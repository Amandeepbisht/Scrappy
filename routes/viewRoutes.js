const express=require('express');
const viewsController=require('./../controller/viewsController');
const authController=require('./../controller/authController');
const userController=require('./../controller/userController');

const router=express.Router();


router.use(authController.isLoggedIn)
//router.use(authController.msgNotify)
router.get('/myProfile/updateMe',authController.msgNotify,viewsController.updateMe)
router.get('/login',viewsController.getLoginForm)
router.get('/forgotPassword',viewsController.forgotPassword)
router.get('/newLoginLink',viewsController.lostLoginLink)
router.get('/myProfile',authController.changeActiveStatus,authController.msgNotify,viewsController.getMyProfile)
//router.get('/myProfile/updateMe',viewsController.updateMe)
router.get('/updatePassword',authController.msgNotify,viewsController.updatePassword)
router.get('/user/:userid',authController.msgNotify,viewsController.getUser)
router.get('/signUp',viewsController.getSignUpForm)
router.get('/otherUsers',authController.msgNotify,viewsController.getAllUsers)
router.get('/resetPassword/:token',viewsController.resetPassword)
router.get('/myMessenger/:friend_id',authController.msgNotify,viewsController.myMessenger)
router.get('/email',viewsController.email)
router.get('/chat/:userid',authController.msgNotify,viewsController.sendMessage)
module.exports=router;