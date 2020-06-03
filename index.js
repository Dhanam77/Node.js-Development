const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');

const PORT = process.env.PORT || 3000;

//Not needed now
//const MongoClient = require('mongodb').MongoClient;   

app.use(express.json());


dotenv.config();
    

//To Routes Folder
const authRoute = require('./Routes/auth');
const userRoute = require('./Routes/users');
const diseaseRoute = require('./Routes/Diseases');


//Connecting to DB
mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log('connected to database')
);


//Will Require /api/auth before @EG signup 
app.use('/api/auth/', authRoute);
app.use('/api', userRoute);
app.use('/api', diseaseRoute);


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

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));