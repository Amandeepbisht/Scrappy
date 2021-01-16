const User=require('./../models/userModel')
const catchAsync=require('./catchAsync')
const Message=require('../models/messageModel')
const AppError=require('./../utils/appError')

exports.resetPassword=catchAsync(async(req,res,next)=>{
    res.status(200).render('resetPassword',{
        token:req.params.token
    })
})
exports.email=catchAsync(async(req,res,next)=>{
    res.status(200).render('welcome_bootstrap')
})

exports.forgotPassword=async(req,res,next)=>{
    res.status(200).render('forgotPassword')
}

exports.getLoginForm=catchAsync(async(req,res,next)=>{
    
    res.status(200).render('login')
})

exports.getSignUpForm=catchAsync(async(req,res,next)=>{
    res.status(200).render('signup')
})

exports.getMyProfile=catchAsync(async(req,res,next)=>{
    
    const user=req.user
    const newMsgs=(req.newMsgs)
    res.status(200).render('my_profile_page',{
        user:user,
        newMsgs:newMsgs.notify
    })
})

exports.getAllUsers=catchAsync(async(req,res,next)=>{
    const newMsgs=(req.newMsgs)
    if(!req.user){
        return next(new AppError('Please log in again',404))
    }
    const users=await User.find();
    let usersArr=[]
    users.forEach(el=> {
        if(el.email!=req.user.email){
            usersArr.push(el)        
        }
    });
    
    res.status(200).render('allUsers',{
        users:usersArr,
        newMsgs:newMsgs.notify

    })    
    
})

exports.getUser=catchAsync(async(req,res,next)=>{
    const newMsgs=(req.newMsgs)
    let otherUser= await User.findOne({_id:req.params.userid})
    
    
    res.status(200).render('otherUser',{
        otherUser:otherUser,
        newMsgs:newMsgs.notify
    })
})

// sending message from a logged in user to an existing user
exports.sendMessage=catchAsync(async(req,res,next)=>{
    const newMsgs=(req.newMsgs)
    let recipient= await User.findById(req.params.userid)
    res.status(200).render('messenger',{
        recipient:recipient,
        newMsgs:newMsgs.notify
    })
})

exports.myMessenger=catchAsync(async(req,res,next)=>{
    if(!req.user){
        return next(new AppError('Please log in again',404))
    }
    
    let user= await User.findById(req.params.friend_id)
    res.status(200).render('myMessenger_scrappy',{
    friend:user
    })
})

exports.updateMe=catchAsync(async(req,res,next)=>{
    const newMsgs=(req.newMsgs)
    if(!req.user){
        return next(new AppError('Please login again',404))
    }
    //console.log(req.user)
    res.status(200).render('updateMe',{
        newMsgs:newMsgs.notify
    })
})

exports.updatePassword=catchAsync(async(req,res,next)=>{
    const newMsgs=(req.newMsgs)
    if(!req.user){
        return next(new AppError('Please login again',404))
    }
    res.status(200).render('updatePassword',{
        newMsgs:newMsgs.notify
    })
})

exports.lostLoginLink=catchAsync(async(req,res,next)=>{
    res.status(200).render('lostLoginLink')
})




