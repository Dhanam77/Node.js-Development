const { registerValidation, loginValidation } = require('../validation');
const User = require('../model/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../model/RefreshToken');

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);


const accessTokenExpiresIn = 300;   //5 mins
const refreshTokenExpiresIn = 24*60*60*30   //One month



//Signing up the user
exports.signup_user = async function (req, res) {

    //Validating using Joi
    const { error } = registerValidation(req.body);

    if (error) {
     return res.status(400).send(error.details[0].message);
    }

    //Check if user exists
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
            res.status(400).json({"success": false, "message":"Email already registered"});
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

/*
        // Create a verification token for this user
        const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        
        // Save the verification token
        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }

            // Send the email
            const transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
            const mailOptions = { from: 'no-reply@yourwebapplication.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
        });
*/
      //  res.header('auth-token', token).send(token);

        res.status(200).send({user: user._id,token: token, refreshToken: refreshToken});

    } catch (err) {
        res.status(400).send(err);
        console.log("Error in registering user " + err);
    }
   
};
exports.login_user =  async function (req, res){
    //Validating using Joi
    const { error } = loginValidation(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //Does email exit?
    const emailExist = await User.findOne({ email: req.body.email });
    if (!emailExist) {
            res.status(400).json({"success": false, "message":"Email doesn't exist"});
    }

    //Is password correct
    const validPassword = await bcrypt.compare(req.body.password, emailExist.password);
    if (!validPassword) {
        res.status(400).json({"success": false, "message":"Invalid Password"});
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

exports.login_otp =  async function (req, res) {

    client.verify
        .services(process.env.SERVICE_ID)
        .verifications
        .create({   //Assuming +91 is already added at the start while sending number
            to: req.body.phoneNumber,
            channel: req.body.channel
        })
        .then((data) => {
            res.status(200).json({"success": true, "message":"OTP sent"});
        })
};

exports.verify_otp =  async function (req, res) {
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
                    res.status(400).json({"success": false, "message":"Error " + err});
                    console.log("Error in registering user " + err);
                });

            }
            //else send old user id
            else{
                res.send({user: oldUser._id, token:token, refreshToken:refreshToken});
            }
            
        }).catch(err => {
            res.status(400).json({"success": false, "message":"Something went wrong " + err});
    })
}; 


exports.logout_user =  async function (req, res) {
  
    const id = req.params.id;

    try{
        await RefreshToken.findOneAndDelete({user_id:id});
        res.status(200).json({"success": true, "message":"Successfully logged out"});
    }
    catch(err){
        res.status(400).json({"success": false, "message":"Something went wrong " + err});
    }
    
};
/*
exports.confirmationToken = function (req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('token', 'Token cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
 
    // Check for validation errors    
    var errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);
 
    // Find a matching token
    Token.findOne({ token: req.body.token }, function (err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token may have expired.' });
 
        // If we found a token, find a matching user
        User.findOne({ _id: token._userId, email: req.body.email }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
 
            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });
};

exports.resendToken = function (req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
 
    // Check for validation errors    
    var errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);
 
    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
        if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });
 
        // Create a verification token, save it, and send email
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
 
        // Save the token
        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
 
            // Send the email
            var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
            var mailOptions = { from: 'no-reply@codemoto.io', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
        });
 
    });
};
*/
async function saveToken(refreshToken, user_id){

    //Create a date to expire the refresh token
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const date = new Date(year, month, day, 00, 00, 00);
    const token = new RefreshToken({
        expireAt: date,
        user_id : user_id,
        token:refreshToken
    });
    try{
        await token.save();
    }
    catch(err){
        res.status(400).json({"success": false, "message":"Error in saving token"});
    }

}