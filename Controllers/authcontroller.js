const { registerValidation, loginValidation } = require('../validation');
const User = require('../model/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);


//Signing up the user
exports.signup_user = async (req, res) => {

    //Validating using Joi
    const { error } = registerValidation(req.body);

    if (error) {
     return res.status(400).send(error.details[0].message);
    }

    //Check if user exists
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        return res.status(400).send('This email is already registered!');
    }


    //Hash Passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);


    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        state: req.body.state,
        city:req.body.city

    });

    try {
        const saveduser = await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {expiresIn:60*60*24});
      //  res.header('auth-token', token).send(token);

        res.status(200).send({user: user._id,token: token});

    } catch (err) {
        res.status(400).send(err);
        console.log("Error in registering user " + err);
    }
   
};
exports.login_user = async (req, res) => {
    //Validating using Joi
    const { error } = loginValidation(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //Does email exit?
    const emailExist = await User.findOne({ email: req.body.email });
    if (!emailExist) {
        return res.status(400).send('Email doesn\'t exist');
    }

    //Is password correct
    const validPassword = await bcrypt.compare(req.body.password, emailExist.password);
    if (!validPassword) {
        return res.status(400).send('Invalid Password');
    };

    //Create and assign JWT Tokens
    const token = jwt.sign({ _id: emailExist._id }, process.env.TOKEN_SECRET, {expiresIn:60*60*24});
    res.header('auth-token', token).send(token);

    // res.send('Logged In');
};
    

//OTP Authentication

exports.login_otp = (req, res) => {

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
};

exports.verify_otp = async(req, res) => {
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
}; 

