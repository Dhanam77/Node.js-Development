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
router.get('/otp/login', (req, res) => {

    client.verify
        .services(process.env.SERVICE_ID)
        .verifications
        .create({   //Assuming you're adding +91 at the start while sending number
            to: req.body.phoneNumber,
            channel: req.body.channel
        })
        .then((data) => {
            res.status(200).send("OTP Sent!")
        })
})


//Call to verify the code sent by user
router.get('/otp/verify', async(req, res) => {
    client.verify
        .services(process.env.SERVICE_ID)
        .verificationChecks
        .create({
            to: req.body.phoneNumber,
            code: req.body.code
        })
        .then(async (data) => {
            const user = new User({
                phoneNumber: req.body.phoneNumber
            })

            //Check if User is already registered
            const oldUser = await User.findOne({phoneNumber:req.body.phoneNumber})

            //If not, make a new user and send old user id
            if(!oldUser){
                user.save()
                .then((savedUser) => {
                    res.send({ user: user._id });

                }).catch(err => {
                    res.status(400).send(err);
                    console.log("Error in registering user");
                });

            }
            //else send old user id
            else{
                res.send({user: oldUser._id});
            }
            
        }).catch(err => {
        res.status(400).send('Something is wrong..');
    })
})


module.exports = router;


