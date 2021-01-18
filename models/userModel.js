const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const crypto=require('crypto') // is have been used to generate the reset password token
const { stringify } = require('querystring')
const userSchema= new mongoose.Schema({
  name:{
    type:String,
    required:[true,'Please tell us your name.'],
    minlength:[4,'Name must have at least 4 letters.'],
    maxlength:[25,'Name must not have more than 25 letters.']
  },
  email:{
    type:String,
    required:[true,'Please provide your email-id.'],
    unique:true,
    lowercase:true,
    validate:[validator.isEmail,'Please povide a valid email.']
  },
  password:{
    type:String,
    required:[true,'Please provide your password.'],
    minlength:[8,'Password must have at least 8 characters.'],
    select:false
   
  },
  passwordConfirm:{
    type:String,
    required:[true,'Please confirm your password.'],
    
    validate:{
      // this only works on   CREATE & SAVE query
      validator:function(el){
        return el==this.password;
      },
      message:'Passwords are not the same.'
    }
  },
  CurrentCity:{
    type:String,
    maxlength:[15,'Current city must not have more than 15 characters.']
  },
  aboutMe:{
    type:String
    
  },
  gender:{
    type:String,
  },
  role:{
    type:String,
    enum:['user','admin'],
    default:'user'
  },
  profilePhoto:{
    type:String,
    default:'https://scrappy-app2.s3.ca-central-1.amazonaws.com/60051d7e28bca63e7c655407-1610948957189.jpeg'

  },
  chatList:[
    {
      blocked:{
        type:Boolean,
        default:false
      },
      email:String,
      name:String,
      friendId:String,
      lastMsgRecievedAt:Date,
      lastMsgSentAt:Date,
      friendPic:String
    }
  ],
  passwordChangedAt:Date,
  passwordResetToken:String,
  passwordResetExpires:Date,
  newestMsgSentAt:Date,
  active:{
    type:Boolean,
    default:false
  }
})

userSchema.pre('save',async function(next){
  // only run this function is the password was actually modified
  if(!this.isModified('password')) {
    return next();
  }
  // hash the passwprd
  this.password=await bcrypt.hash(this.password,12);
  // do no save the confirmed password
  this.passwordConfirm=undefined;
  next();
})

userSchema.pre('find',function(next){
  this.find({active:{$ne:false}})
  next();
})

userSchema.methods.comparePassword=async function(candidatePassword,userPassword){
  return  await bcrypt.compare(candidatePassword,userPassword);
}

userSchema.methods.changedPasswordAfter=function(jwtTimeStamp){
  if(this.passwordChangedAt){
    const changedTimeStamp=parseInt(this.passwordChangedAt.getTime()/1000)
    
    return (changedTimeStamp>jwtTimeStamp)
  }
  return false
}

userSchema.methods.resetToken=function(){
  // 1) Generate a reset token and save the hashed one in the DB
  const resetToken=crypto.randomBytes(32).toString('hex');
  this.passwordResetToken=crypto
                          .createHash('sha256')
                          .update(resetToken)
                          .digest('hex');
  this.passwordResetExpires=Date.now()+(10*60*1000)                        
  // 2) return the newly created token(unhashed)
  
  return resetToken
}



const User=mongoose.model('User', userSchema)

module.exports=User;