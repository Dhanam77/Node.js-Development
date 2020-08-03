const router = require('express').Router();
const AuthController = require('../Controllers/authcontroller.js');
const User = require('../model/User.js');


const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

/*
 * LOCAL AUTHENTICATION 
 * 
*/

//SIGNUP
router.post('/signup', AuthController.signup_user);

//LOGIN
router.post('/login', AuthController.login_user);


//Call when User clicks on Register/Login using OTP
router.post('/otp/login', AuthController.login_otp);


//Call to verify the code sent by user
router.post('/otp/verify', AuthController.verify_otp);

//Logout a user
router.get('/logout/:id', AuthController.logout_user);

//Verify a user
//router.post('/confirmation', AuthController.confirmationToken);

//router.post('/resend', AuthController.resendToken);


module.exports = router;


