// 1) store image as a buffer using multer
// 2) resize image using sharp and give it a name
// 3) save image using multer-S3
const aws=require('aws-sdk')
var multerS3 = require('multer-s3-transform')
const multer=require('multer')
const sharp= require('sharp')
const AppError = require('../utils/appError')
const catchAsync = require('./catchAsync')

const multerFilter=(req,file,cb)=>{
  
  if(file.mimetype.split('/')[0]!='image'){
    cb(new AppError('Please upload only images',404),false)
  }
  cb(null,true)
}

const fileName=(req)=>{
  if (req.user){
    return `${req.user.id}-${Date.now()}.jpeg`
  }
  return `${req.body.email}-${Date.now()}.jpeg`
}

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_KEY_SECRET
})
let upload=multer({
  storage:multerS3({
    s3:s3,
    bucket:'scrappy-app2',
    shouldTransform: function (req, file, cb) {
      cb(null, /^image/i.test(file.mimetype))
    },
    transforms: [
    {
      id: 'thumbnail',
      key: function (req, file, cb) {
        cb(null, fileName(req))
      },
      transform: function (req, file, cb) {
        cb(null,sharp()
          .resize(400,350)
          .toFormat('jpeg')
          .jpeg({quality:90})
          .withMetadata()
        )
      }
    }]
  }),
  fileFilter:multerFilter
})

exports.uploadS3=upload.single('photo')

