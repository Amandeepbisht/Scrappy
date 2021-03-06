const express=require('express');
const userController=require('./../controller/userController')
const photoController=require('./../controller/photoController')
const authController=require('./../controller/authController')
const router=express.Router()


router
  .route('/')
  .post(authController.protect,userController.getAllUsers)
router
  .route('/resendLoginLink')
  .post(authController.lostLoginLink)

router
  .route('/signUp')
  .post(photoController.uploadS3,
    authController.signUp)

router
  .route('/login')  
  .post(authController.logIn)

router  
  .route('/logout')
  .get(authController.logout)
router
  .route('/forgotPassword')
  .post(authController.forgotPassword)

router
  .route('/myProfile')
  .get(authController.protect,userController.myProfile)



router
  .route('/:email')
  .get(userController.getUserByEmail)
  
router
  .route('/resetPassword/:token')
  .patch(authController.resetPassword)  

router
  .route('/updatePassword')
  .patch(authController.protect,authController.updatePassword)
 
router  
  .route('/updateMe')
  .patch(authController.protect,
    photoController.uploadS3,
    userController.updateMe)

router  
  .route('/deleteMe')
  .delete(authController.protect,userController.deleteMe)  

router  
  .route('/block_user')
  .patch(authController.protect,userController.block)
router  
  .route('/unblock_user')
  .patch(authController.protect,userController.unblock)

router  
  .route('/uploadS3')
  .post(authController.protect,
    photoController.uploadS3)

  
module.exports=router;
