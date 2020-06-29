const router = require('express').Router();
const verify = require('../VerifyToken');
const UserController = require('../Controllers/usercontroller');

//Route to get a list of all users
router.get('/users',verify, UserController.get_user);

//Get Pre-Diagnosis Questions 
router.get('/user/info/:id',  UserController.get_userinfo);

//Get profile information of specific user
router.get('/user/profile/:id', UserController.get_profile);


//Edit the profile of specific user
router.post('/user/profile/edit/:id', UserController.edit_profile);

//Save User data after getting data from asking basic questions in pre-diagnosis questions
router.post('/user/profile/save/:id', UserController.save_user_data);

//Set medical conditions of the user after getting data from asking medical questions in pre-diagnosis questions
router.post('/user/medical/:id', UserController.set_medical_condition);

//Get medical conditions of user
router.get('/user/medical/:id', UserController.get_medical_conditions);

//Get user circle
router.get('/user/medical/circle/:id', UserController.get_user_circle);

module.exports = router;