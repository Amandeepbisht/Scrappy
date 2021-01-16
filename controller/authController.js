const {promisify}=require('util')
const User=require('../models/userModel')
const catchAsync=require('./catchAsync')
const jwt=require('jsonwebtoken')
const AppError = require('../utils/appError')
const sendEmail = require('../utils/email')
const crypto = require('crypto')


const signToken=(userId)=>{
  return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:'90d'}) 
}

const createSendToken=(statusCode,user,res,req)=>{
  let token=signToken(user._id)
  let cookieOptions={
    expires:new Date(Date.now()+process.env.COOKIE_EXPIRES*24*60*60*1000),
    httpOnly:true
    }
  if(process.env.NODE_ENV=='production'){
    cookieOptions.secure= req.headers['x-forwarded-proto'] === 'https';
  }
  user.password=undefined;// the password does not show up in the response
  res.cookie('jwt',token,cookieOptions)
  
  res.status(statusCode).json({
    status:'success',
    data:{
      user
    }
    
  })
  
}


exports.signUp=catchAsync(async(req,res,next)=>{
  
  let signUpObj=req.body
  if(req.file){signUpObj.profilePhoto=req.file.filename}
  const user= await User.create(signUpObj)
  const url = `${req.protocol}://${req.get('host')}/myProfile`
  
  await new sendEmail(user,url).sendWelcome('welcome','Welcome to scrappy')
  createSendToken(200,user,res,req);
})

// deletes the user 
exports.lostLoginLink=catchAsync(async(req,res,next)=>{
  

  let user=await User.findOne({email:req.body.email})
  if(user==undefined){
    return next(new AppError('Cannot find you. Please check your email-id.',404))
  }
  if(user.active==true){
    return next(new AppError("Sorry, a new link can't be sent at your id, as you have been registered already. Use 'Forgot Password' to login again.",404))
  }
  const url = `${req.protocol}://${req.get('host')}/myProfile`
  await new sendEmail(user,url).sendWelcome('welcome','Welcome to scrappy')
  createSendToken(200,user,res,req);
})


exports.logIn=catchAsync(async(req,res,next)=>{
  
  const {email,password}=req.body;
  //1) check is email and password are there in the request
  if(!email||!password){
    return next(new AppError('Please enter email and password',400))
  }
  //2) check if the user exists in the DB
  let user= await (await User.findOne({email:email}).select('+password'))
  if(!user){
    return next(new AppError('Invalid email-id or password',400))
  }
  // 3) check if the password is correct
 let correct= await user.comparePassword(password,user.password)
 if(correct==false){
    return next(new AppError('Incorrect email-id or password',404))
  }
  if(user.active==false){
    return next(new AppError('This email-id is not registered yet!',404))
  }
  
  createSendToken(200,user,res,req)
  
})

exports.protect= catchAsync(async(req,res,next)=>{
  
  let token;
  //1) getting token and check if its there
  
  if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
   
    token=req.headers.authorization.split(' ')[1]
  }
  //console.log(req.headers.cookie.jwt)
  //1A) if no token then fetch it from the cookie 
  if(!token){
    token=req.cookies.jwt;
  }
  //2) verification token
  let decoded= await promisify(jwt.verify)(token,process.env.JWT_SECRET)
 
  //3) check if the user still exist
  let freshUser=await User.findOne({_id:decoded.id});
  if(!freshUser){
    return  next( new AppError('The user no more exist',401))
  }
  //4) check if user changed password after the token was issued
  if(freshUser.changedPasswordAfter(decoded.iat)){
    return next(new AppError('Your password have been changed...please use the new one to continue...',401))
  }
  req.user=freshUser;
  res.locals.user=freshUser
  
  next();
})

exports.isLoggedIn=async(req,res,next)=>{
  
  try{
    let token
    
    //1 check if we have the token in the cookie
    
    if(req.cookies.jwt){
        
        token=req.cookies.jwt
        

       //2) verify the token
        let decoded= await promisify(jwt.verify)(token,process.env.JWT_SECRET)
        //3) fetch the user from the verififed token
        const freshUser=await User.findById(decoded.id)
        if(!freshUser){
          
          return next();
        }
        if(freshUser.changedPasswordAfter(decoded.iat)){
          return next(new AppError('Your password has been chaged recently, please login again',404));
        }
        req.user=freshUser;
        res.locals.user=freshUser;
        
      return next();   
      }
    next();
  }
  catch(err){
    next()
  }
}

exports.forgotPassword=async(req,res,next)=>{
  let user, token
  //1) get the email id and see if the user actually exists
  user= await User.findOne({email:req.body.email})
  if(!user){return next (new AppError('There is no user registered with this email-id',404))}
  //2) generate a token
  token=user.resetToken();
  await user.save({validateBeforeSave:false})
  //3) send it to the user
  const resetURL= `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${token}`
  const message=`Forgot Password? Submit a patch request with a new password and confirm password to ${resetURL}.`
  const resetUrl_frontend=`${req.protocol}://${req.get('host')}/resetPassword/${token}`
  try{
    await new sendEmail(user,resetUrl_frontend).sendLoginLink()
    res.status(200).json({
      status:'success',
      message:'A Login Link has been sent to your email-id'
    })
  }
  catch(err){
    
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    await user.save({validateBeforeSave:false})
    return next(new AppError('There was an error in sending the mail. Please try again later',500))
  }
  
}

exports.resetPassword=catchAsync(async(req,res,next)=>{
  //1) get user based on the token
  const userToken=req.params.token
  const hashedToken= crypto
                      .createHash('sha256')
                      .update(userToken)
                      .digest('hex');
  const user= await User.findOne({passwordResetToken:hashedToken})
  
  
  if(!user){
    return next(new AppError('The user exist no more',401))
  }
  // 2) if token not expired and there is user, set the new password
  if(user.passwordResetExpires<Date.now()){
    return next(new AppError('The link is expired. Please get another one',401))
  }
  if(req.body.password!=req.body.passwordConfirm){
    return next(new AppError('Passwords do not match. Please confirm password again!'),404)
  }
  user.password=req.body.password;
  user.passwordConfirm=req.body.passwordConfirm;
  user.passwordChangedAt=Date.now();
  user.passwordResetToken=undefined;
  user.passwordResetExpires=undefined;
  // 3) update password property of the user
  await user.save();
  // 4) log the user in and the token to the user
  createSendToken(200,user,res,req)
})         

exports.updatePassword=catchAsync(async(req,res,next)=>{
  let user,candidatePassword
  user=req.user
  // 1) fetch password from the user account
  user= await User.findOne({_id:user._id}).select('+password');
  candidatePassword=req.body.password;
  // 2) compare password with the request password
  let correct= await user.comparePassword(candidatePassword,user.password)
  if(correct==false){
    return next(new AppError('Incorrect password..please try again',401))
  }
  // 3) update the password
 
  user.password=req.body.newPassword;
  user.passwordConfirm=req.body.confirmPassword;
  if(user.password!=user.passwordConfirm){
    return next(new AppError("Passwords didn't match. Please confirm your password again",401))
  }
  user.passwordChangedAt=Date.now();
  await user.save();
  createSendToken(200,user,res,req)
})

exports.logout=catchAsync(async(req,res,next)=>{
  let token='null'
  res.cookie('jwt',token,{
    expires:new Date(Date.now()+(10*1000)),
    httpOnly:true
  })
  res.cookie('newMsgs','null',{
    expires:new Date(Date.now()),
    httpOnly:true
  })
  res.status(200).json({
    status:'success',
    message:'Your are successfully logged out!'
  })
})

exports.changeActiveStatus=catchAsync(async (req,res,next)=>{
  
  if(req.user.active==false){
    
    await User.findByIdAndUpdate(req.user._id,{active:true})
    req.user=await User.findById(req.user._id)
    next()
  } 
  next()

})

exports.msgNotify=(req,res,next)=>{
  let chatList=req.user.chatList;
  let newMsgs=0
  let obj={}
  chatList.forEach(el=>{
    if(el.lastMsgRecievedAt>el.lastMsgSentAt||el.lastMsgSentAt==undefined){
      newMsgs+=1
    }
  })
  if(newMsgs==0){
    obj.notify=''
  }
  else{
    obj.notify=newMsgs
  }
  
  req.newMsgs=(obj)
  next();
}

