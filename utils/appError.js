
class AppError extends Error{
  constructor(message,statusCode){
    super(message);
    this.statusCode=statusCode;
    this.isOperational=true;
    if(`${this.statusCode}`.startsWith('4')){
      this.status='error'
    }
    else{
      this.status='fail'
    }
    Error.captureStackTrace(this,this.constructor)
    
  }
}

module.exports=AppError;