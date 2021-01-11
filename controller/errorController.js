const AppError = require("../utils/appError")

const sendErrorDev=(err,req,res)=>{
    
    if(req.originalUrl.startsWith('/api')){
       res.status(err.statusCode).json({
        status:err.status,  
        message:err.message,
        stack:err.stack,
        error:err,
        errorName:err.name
      })
    }
    else{
      
       res.status(err.statusCode).render('error_page',{
        error:err.stack,
        message:err.message
      })
    }
    


}

const sendErrorProd=(err,req,res)=>{
  // FOR API
  if(req.originalUrl.startsWith('/api')){
    // trusted operational error
    if(err.isOperational){
  
      return res.status(err.statusCode).json({
         status:err.status,
         message:err.message
       })
     }
     // Programming or other unknown error
     else{
       
       //1) log the error
       console.log('ERROR',err)
       //2) send the generic message
       return res.status(err.statusCode).json({
         message:'Something went really wrong..pls try again later'
       })
     }
   
  }
  // FOR rendered website
  if(err.isOperational){
   return res.status(err.statusCode).render('error_page',{
      status:err.status,
      message:err.message
    })
  }
  console.log(err)
  
  return res.status(err.statusCode).render('error_page',{
    status:err.status,
    message:'Please try again later'
    
  })
  
}

const handleJwtError=(err)=>{
  return new AppError('Invalid token',401)
}
const handleCastErrorDB=(err)=>{
  return new AppError(`invalid ${err.path}:${err.value}`,400)
}
const handleDuplicateKeyError=(err)=>{
  
  const msg=err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
 
  console.log(msg)
  return new AppError(`${msg} already exists`,400)
}

const handleValidationError=(err)=>{
  
  const errors=Object.keys(err.errors).map(x=>{return (err.errors[x].message)})
  console.log(errors)
  let message=`${errors.join('')}`
  
  return new AppError(message,400)
}


module.exports=(err,req,res,next)=>{
 
  
  err.status=err.status|| 'error'
  err.statusCode=err.statusCode||500

 
  if(process.env.NODE_ENV=='development'){
    sendErrorDev(err,req,res)
  }
  if(process.env.NODE_ENV=='production'){
    console.log("Hey this the error in production mode....fix it ")
    if (err.name=="CastError"){err=handleCastErrorDB(err)}
    if (err.code=="11000"){ err=handleDuplicateKeyError(err)}
    if (err.name=="ValidationError"){
      console.log("hey guess what its a validation error in production")
      err=handleValidationError(err)}
    if (err.name=="JsonWebTokenError"){err=handleJwtError(err)}
    
    sendErrorProd(err,req,res)
  }
}

