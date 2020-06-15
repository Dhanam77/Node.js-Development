const router = require('express').Router();
const User = require('../model/User');
const verify = require('../VerifyToken');
const UserController = require('../Controllers/usercontroller');

//Route to get a list of all users
router.get('/users',verify, UserController.get_user);

//Get Pre-Diagnosis Questions 
router.get('/user/info/:id', UserController.get_userinfo);



//Get profile information of specific user
router.get('/user/profile/:id', UserController.get_profile);


//Edit the profile of specific user
router.post('/user/profile/:id', UserController.edit_profile);


module.exports = router;