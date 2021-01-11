const mongoose=require('mongoose');

const chatSchema= new mongoose.Schema({
  pair:[String],
  messages:[Object],
  createdAt:{
    type:Date
  },
  updatedAt:{
    type:Date
  }
})
const Chat=mongoose.model('Chat',chatSchema)
module.exports=Chat