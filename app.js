const express=require("express");
const morgan=require('morgan')
const cookieParser=require('cookie-parser')
const userRouter=require('./routes/userRoutes')
const messageRouter=require('./routes/messageRoutes')
const viewsRouter=require('./routes/viewRoutes')
const AppError=require('./utils/appError')
const globalErrorHandler=require('./controller/errorController')
const rateLimit=require('express-rate-limit')
const helmet=require('helmet')
const mongoSanitize=require('express-mongo-sanitize')
const xss=require('xss-clean'); 
const path=require('path')

const app=express();
app.set('view engine','pug')
app.set('views','./views')
app.use(helmet()) // SET SECURITY HTTP HEADERS 
app.use(express.json({limit:'10kb'})) // READS THE DATA COMING FROM THE REQUESTS IN JSON FORMAT
app.use(express.static(path.join(__dirname,'dev-data')))
const limiter=rateLimit({ 
  max:100,
  windowMs:60*60*1000,
  message:'too many requests from this IP, please try in an hour'
})

//app.use('/api/v1/user',limiter) // LIMITS THE NUMBER OF REQUESTS 

app.use(mongoSanitize()) // protect against the NOSQL query injection
app.use(xss()) // protect against xss sttacks
app.use(cookieParser())
app.use((req,res,next)=>{
  req.requestTime= new Date().toISOString();
  //console.log(req.cookies)
   next()
})

app.use('/',viewsRouter)
app.use('/api/v1/user',userRouter)
app.use('/api/v1/message',messageRouter)
app.all('*',(req,res,next)=>{
  const err=new AppError('sorry this route has not been defined yet',404)
  next(err);
})

app.use(globalErrorHandler)
module.exports=app;