module.exports=fn=>{
  return (req,res,next)=>{
    fn(req,res,next).catch(err=>{
      console.log("This is the log from line #4 of catchAsync.js")
      console.log(err)
      next(err)})
  }
}
