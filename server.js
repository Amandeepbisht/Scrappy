const dotenv=require('dotenv');
const mongoose=require('mongoose')
dotenv.config({path:'./config.env'})

process.on('uncaughtException',err=>{
  console.log('UNCAUGHT EXCEPTION...SHUTTING DOWN!')
  console.log(err.name, err.message,err.stack);
  process.exit(1);
})

const app=require('./app')
const DB=process.env.CONNECTION_STRING
mongoose.connect(DB,{
  useNewUrlParser: true,
  useCreateIndex:true,
  useFindAndModify:false,
  useUnifiedTopology:true
}).then(con=>{
  
  console.log('DB connection successful!')
}).catch(err=>{
  console.log(err)
})
const port=3000;

app.listen(port,()=>{
  console.log(`app running on port ${port}...`)
  console.log(`This is ${process.env.NODE_ENV} mode`)
  
})

process.on('unhandeledRejection',err=>{
  console.log(err.name,err.message)
  console.log('UNHANDELED REJECTION!...SHUTTING DOWN')
  server.close(()=>{
    process.exit(1);
  })
})

