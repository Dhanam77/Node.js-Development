const router = require('express').Router();
const VerifyToken = require('../VerifyToken');
const UserController = require('../Controllers/usercontroller');

//Route to get a list of all users
router.get('/users',VerifyToken, UserController.get_user);

//Get Pre-Diagnosis Questions 
router.get('/user/info/:id',VerifyToken,  UserController.get_userinfo);

//Get profile information of specific user
router.get('/user/profile/:id',VerifyToken, UserController.get_profile);


//Edit the profile of specific user
router.post('/user/profile/edit/:id',VerifyToken, UserController.edit_profile);

//Save User data after getting data from asking basic questions in pre-diagnosis questions
router.post('/user/profile/save/:id',VerifyToken, UserController.save_user_data);

//Set medical conditions of the user after getting data from asking medical questions in pre-diagnosis questions
router.post('/user/medical/:id', VerifyToken,UserController.set_medical_condition);

//Get medical conditions of user
router.get('/user/medical/:id',VerifyToken, UserController.get_medical_conditions);

//Get user circle
router.get('/user/medical/circle/:id', VerifyToken, UserController.get_user_circle);

module.exports = router;