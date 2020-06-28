const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
require('./config/passport');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_SECRET,
    "http://localhost/3000/google/signup/callback");




const PORT = process.env.PORT || 3000;

//Not needed now
//const MongoClient = require('mongodb').MongoClient;   

app.use(express.json());


dotenv.config();
    

//To Routes Folder
const authRoute = require('./Routes/auth');
const userRoute = require('./Routes/users');
const diseaseRoute = require('./Routes/Diseases');
const refreshRoute = require('./Routes/refresh');
const doctorRoute = require('./Routes/doctor');
const searchRoute = require('./Routes/search');

//Connecting to DB
mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log('connected to database')
);


//Will Require /api/auth before @EG signup 
app.use('/api/auth/', authRoute);
app.use('/api', userRoute);
app.use('/api', diseaseRoute);
app.use('/api',refreshRoute);
app.use('/api',doctorRoute);
app.use('/api',searchRoute);


app.use(passport.initialize());

app.get('/failed', (req, res) => {
    res.send('Sorry bruh');
})


app.get('/passed', (req, res) => {
    res.send('Welcome bruh');
})


/*
 * GOOGLE AUTHENTICATION
 */

 /* This is passport authentication of google! 
app.get('/google/signup', passport.authenticate('google', { scope: ['profile', 'email'] }));


app.get('/google/signup/callback',
    passport.authenticate('google', { failureRedirect: '/failed' }),
    function (req, res) {
        res.redirect('/passed');
    });



//Check get call
app.get('/', (req, res) => {
    res.send('You get what you want')
});
*/


app.get('/google/signup', (req, res) => {
    const {idToken} = req.body;
    verify(idToken).catch(console.error);
});
async function verify(token) {
    const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    console.log(userid);
    User.findOne({ googleId: userid }).then(existingUser => {
    if (!existingUser) {
        const user = new User({
            phoneNumber: req.body.phoneNumber
        })

        
        user.save()
            .then((savedUser) => {
                res.send({ user: user._id });

            }).catch(err => {
                res.status(400).send(err);
                console.log("Error in registering user");
            });
    }
    });
    }

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));