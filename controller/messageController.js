const Message=require('../models/messageModel')
const catchAsync=require('./catchAsync')
const AppError=require('./../utils/appError')
const User=require('./../models/userModel')
const Chat=require('./../models/chatModel')

const generateMessage=(req,senderId,recieverId)=>{
  let message={}
  message.text=req.body.text
  message.generatedAt=new Date(Date.now()).toString()
  message.sender=senderId
  message.reciever=recieverId
  return message
}


// sending message from a logged in user to an existing user
exports.sendMessage=catchAsync(async(req,res,next)=>{
  let senderId,recieverId,reciever,sender
  senderId=req.body.sender_id
  recieverId=req.body.reciever_id
 


  //1) get reciever from the id and check if that user still exists
  sender=await User.findById(senderId)
  reciever = await User.findById(recieverId)
  

  if(!reciever){
    return next(new AppError('This user does not exist anymore')) 
  }
  
  //2) check if the receiver have sender in his/her chat list
  let isFriend=reciever.chatList.find(el => el.email==sender.email)
  
  //3) check if receiver have blocked the sender 
  if(isFriend&&isFriend.blocked==true){
    return next(new AppError('You are not allowed to send message, since you have been blocked by this user. ',404))
  }

  //4) generate message. Since the reciever is not blocked the, message has to be generated
  const newMessage=generateMessage(req,senderId,recieverId)
  let sentMessage= await Message.create(newMessage)
  
  //5) If the sender is not in chatList create a new "Chat" document and add sender
  //   to the recipient's chatList vice versa
  
  const date=new Date() //----> setting date for updated time of "chat" object
  if(isFriend==undefined){
    
    let chatDoc={}
    chatDoc.pair=[senderId,recieverId]
    chatDoc.messages=[sentMessage]
    chatDoc.createdAt=date.toUTCString()
    chatDoc.updatedAt=date.toUTCString()
    await Chat.create(chatDoc)
    
    let senderFriend={
      email:sender.email,
      name:sender.name,
      friendId:sender._id,
      lastMsgRecievedAt:date.toUTCString(),
      friendPic:sender.profilePhoto
    }
    
    reciever.chatList.push(senderFriend)
    reciever.save({validateBeforeSave:false})

    let recieverFriend={
      email:reciever.email,
      name:reciever.name,
      friendId:reciever._id,
      lastMsgSentAt:date.toUTCString(),
      friendPic:reciever.profilePhoto
    }
    sender.chatList.push(recieverFriend)
    sender.save({validateBeforeSave:false})
  }

  //6) Check If sender is in the chatList and if the sender is blocked or not  
  //   find the chat document and add message to it
  
  
  let recipient=sender.chatList.find(el=>el.email==reciever.email)
  let isBlocked
  isBlocked=recipient.blocked
  if(isFriend!=undefined&&isBlocked==false){
    await User.updateOne(
      {_id:recieverId,"chatList.friendId":senderId},
      {$set:{"chatList.$.lastMsgRecievedAt":date.toUTCString()}
      }
      )
    await User.updateOne(
      {_id:senderId,"chatList.friendId":recieverId},
      {$set:{"chatList.$.lastMsgSentAt":date.toUTCString()},
      newestMsgSentAt:date.toUTCString()}
      )  
    await Chat.findOneAndUpdate({pair:{$all:[senderId,recieverId]}},
                                {
                                  $push:{messages:sentMessage},
                                  updatedAt:date.toUTCString()
                                },
                                {new:true})  
  }
  if(isFriend!=undefined&&isBlocked==true){
    return next(new AppError('You have blocked this user...click the "Unblock Contact" button to send message',404))
  }
  res.status(200).json({
    status:'success',
    message:sentMessage,
    sender:sender 
  })
})

exports.getMessages=catchAsync(async(req,res)=>{
  
  const sender=req.query.sender_id
  const recipient=req.query.reciever_id
  
  const sortedMessages= await Chat.aggregate([
    {$match:{pair:{$all:[sender,recipient]}}},
    {$unwind:'$messages'},
    {$sort:{'createdAt':1}}
    

  ])  
  const messageArray= []
  sortedMessages.forEach(el=>messageArray.push(el.messages))
                       
  res.status(200).json({
    status:"success",
    data:{
      messageArray
    }
  })

})

exports.myMessenger=async(req,res,next)=>{
  res.status(200).render('messenger')
}