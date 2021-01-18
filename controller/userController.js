const AppError = require('../utils/appError')
const User=require('./../models/userModel')
const catchAsync=require('./catchAsync')
const multer=require('multer');
const aws=require('aws-sdk')

const sharp=require('sharp')

// const multerStorage=multer.diskStorage({
//   destination:(req,file,cb)=>{
//     cb(null,`dev-data/images`)
    
//   },
//   filename:(req,file,cb)=>{
//     const ext=file.mimetype.split('/')[1]
//     cb(null,`user-${req.user.id}-${Date.now()}.${ext}`)
//   }
// })

// const multerStorage=multer.memoryStorage()
// const multerFilter=(req,file,cb)=>{
//   if(file.mimetype.startsWith('image')){
    
//     cb(null,true)
//   }
//   else{
//     cb(new AppError('Not an image file! please upload only images.',400),false)
//   }
// }
// const upload=multer({
//   storage:multerStorage,
//   fileFilter:multerFilter
// })
// exports.uploadUserPhoto=upload.single('photo')
// exports.resizeUserPhoto=(req,res,next)=>{
//   if(!req.file){return next()}
//   if(req.user){req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`}
//   else if(!req.user){req.file.filename=`user-${req.body.email}-${Date.now()}.jpeg`}
  
//   sharp(req.file.buffer)
//     .resize(400,350)
//     .toFormat('jpeg')
//     .jpeg({quality:90})
//     .withMetadata()
//     .toFile(`dev-data/images/${req.file.filename}`)
//     next();
// }



exports.getAllUsers=async(req,res)=>{
  try{
    const users=await User.find()
      res.status(200).json({
      status:"success",
      users:users
    })
  }
  catch(err){
    res.status(404).json({
      status:'fail',
      message:err
    })
  }
}




exports.getUserByEmail=catchAsync(async(req,res,next)=>{
  const user=await User.findOne({email:req.params.email})
  if(!user){
    return (next(new AppError('There is no user with this name',404)))
  }
  res.status(200).json({
    status:'success',
    data:{
      user
    }
  })
})


exports.updateMe=catchAsync(async(req,res,next)=>{
  let user
  user=req.user;

 //1) create Error if user tries to update the password
 if(req.body.password){
   return next(new AppError('This route is not to update password',401))
 }
 //2) do not allow to update email  
 let newObj={}
 let obj=req.body;
 let excludedFields=['email']
 Object.keys(obj).map(el=>{
   if(excludedFields.includes(el)==false){
      newObj[el]=obj[el]
   }
 })

 
 if(req.file){
   newObj.profilePhoto=req.file.transforms[0].location
 }
 
 let updatedUser=await User.findByIdAndUpdate(user._id,newObj,{runValidators:true})

 
 res.status(200).json({
   status:"success",
 
   data:{
     updatedUser
   }
 })
})

exports.deleteMe=catchAsync(async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user._id,{active:false})
  res.status(204).json({
    status:'success',
    data:null,
    message:'Your account have been deactivated'
  })
})

exports.myProfile=catchAsync(async(req,res,next)=>{
  
  
  let user=req.user
  if(user.active==false){
    await User.findByIdAndUpdate(user._id,{acive:true})
    user=await User.findById(user._id)
  }
  let friendArray=[]
  user.chatList.forEach(el => {
    friendArray.push({
      friendId:el.friendId,
      name:el.name,
      email:el.email,
      blocked:el.blocked,
      lastMsgRecievedAt:el.lastMsgRecievedAt,
      lastMsgSentAt:el.lastMsgSentAt,
      friendPic:el.friendPic
    })
  })
  friendArray.sort((a,b)=>{
    return new Date(b.lastMsgSentAt)- new Date(a.lastMsgSentAt)
  })
  let newestMsgSentAt=user.newestMsgSentAt
  
  res.status(200).json({
    status:'success',
    data:{
      arr:friendArray,
      newestMsgSentAt:newestMsgSentAt,
      user:user
    }
  })
})

exports.block=catchAsync(async(req,res,next)=>{
  let friend_id=req.body.friend_id
  let user=req.user
  
 
  await User.updateOne(
    {_id:user._id,"chatList.friendId":friend_id},
    {$set:{"chatList.$.blocked":true}}
    )
  res.status(200).json({
    status:'success',
    message:'The user have been blocked sucessfully'
  })
})

exports.unblock=catchAsync(async(req,res,next)=>{
  let friend_id=req.body.friend_id
  let user=req.user
  
 
  await User.updateOne(
    {_id:user._id,"chatList.friendId":friend_id},
    {$set:{"chatList.$.blocked":false}}
    )
  res.status(200).json({
    status:'success',
    message:'The user have been unblocked successfully'
  })
})

// this function checks if there users in the chatList of logged in user
// have updated there name or profile photo
exports.checkUpdate=catchAsync(async(req,res,next)=>{
  
  let user_id=req.user._id;
  let arr=req.originalUrl.split('/')
  let friend_id=(arr[arr.length-1])
  let friend=await User.findById(friend_id)
  await User.updateOne(
    {_id:user_id, "chatList.friendId":friend_id},
    {$set:{"chatList.$.name":friend.name,"chatList.$.friendPic":friend.profilePhoto}}
  )
  next()
})

exports.updateMeS3=catchAsync(async(req,res,next)=>{
  console.log(req.file)
  console.log(req.file.transforms[0].location)
  let user=await User.findById(req.user._id)
  await User.findByIdAndUpdate(req.user._id,{profilePhoto:req.file.transforms[0].location})
  res.status(200).json({
    status:'success'
  })
})