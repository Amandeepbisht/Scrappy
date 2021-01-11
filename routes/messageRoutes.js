const express=require('express')
const router=express.Router()
const messageController=require('./../controller/messageController')
const authController=require('./../controller/authController')

router
  .route('/:recieverId')
  .post(authController.protect,messageController.sendMessage)

router
  .route('/getChatMessages')
  .get(messageController.getMessages)  

router
  .route('/myMessenger',messageController.myMessenger)


module.exports=router;  