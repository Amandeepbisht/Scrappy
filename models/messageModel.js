const mongoose=require("mongoose");

const messageSchema = new mongoose.Schema({

  generatedAt:{
    type:Date
  },
  text:{
    type:String
  },
  sender:{
    type:String
  },
  reciever:{
    type:String
  }
})

const Message=mongoose.model('Message',messageSchema)

module.exports= Message;