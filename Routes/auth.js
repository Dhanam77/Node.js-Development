const router = require('express').Router();


const AuthController = require('../Controllers/authcontroller.js');


/*
 * LOCAL AUTHENTICATION 
 * 
*/

//SIGNUP
router.post('/signup', AuthController.signup_user);

//LOGIN
router.post('/login', AuthController.login_user);



module.exports = router;


