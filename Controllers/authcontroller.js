const { registerValidation, loginValidation } = require('../validation');
const User = require('../model/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../model/RefreshToken');

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);


const accessTokenExpiresIn = 300;   //5 mins
const refreshTokenExpiresIn = 24*60*60*30   //One month



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
        type:req.body.type,
        state: req.body.state,
        city:req.body.city

    });

    try {
        const saveduser = await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {expiresIn:accessTokenExpiresIn});
        const refreshToken = jwt.sign({_id:user._id }, process.env.REFRESH_TOKEN_SECRET, {expiresIn:refreshTokenExpiresIn})
        saveToken(refreshToken, user._id);


      //  res.header('auth-token', token).send(token);

        res.status(200).send({user: user._id,token: token, refreshToken: refreshToken});

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
    const token = jwt.sign({ _id: emailExist._id }, process.env.TOKEN_SECRET, {expiresIn:accessTokenExpiresIn});
    const refreshToken = jwt.sign({_id:emailExist._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn:refreshTokenExpiresIn})

    saveToken(refreshToken, emailExist._id);



    res.status(200).send({user: emailExist._id, token: token, refreshToken: refreshToken});

    //res.header('auth-token', token).send(token);

    // res.send('Logged In');
};
    

//OTP Authentication

exports.login_otp = (req, res) => {

    client.verify
        .services(process.env.SERVICE_ID)
        .verifications
        .create({   //Assuming +91 is already added at the start while sending number
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
            const token = jwt.sign({ _id: oldUser._id }, process.env.TOKEN_SECRET, {expiresIn:accessTokenExpiresIn});
            const refreshToken = jwt.sign({_id:oldUser._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn:refreshTokenExpiresIn})

            saveToken(refreshToken, oldUser._id);
            //If not, make a new user and send old user id
            if(!oldUser){
                user.save()
                .then((savedUser) => {
                    res.send({ user: user._id, token:token, refreshToken:refreshToken});

                }).catch(err => {
                    res.status(400).send(err);
                    console.log("Error in registering user " + err);
                });

            }
            //else send old user id
            else{
                res.send({user: oldUser._id, token:token, refreshToken:refreshToken});
            }
            
        }).catch(err => {
        res.status(400).send('Something is wrong..' + err);
    })
}; 


exports.logout_user = async(req,res) => {
  
    const id = req.params.id;

    try{
        await RefreshToken.findOneAndDelete({user_id:id});
        res.status(200).send('Successfully logged out');
    }
    catch(err){
        res.status(400).send('Error in logging user out ' + err);
    }
    
};

async function saveToken(refreshToken, user_id){

    //Create a date to expire the refresh token
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const date = new Date(year, month, day, 00, 00, 00);
    console.log(date);
    const token = new RefreshToken({
        expireAt: date,
        user_id : user_id,
        token:refreshToken
    });
    try{
        await token.save();
    }
    catch(err){
        res.status(400).send('Error in saving token ' + err);
    }

}