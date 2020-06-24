const mongoose = require('mongoose');


//Only Email and Password are necessary for local auth.
//Only phone no required for otp auth
 

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String,
        min:6

    },
    type:{
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    age: {
        type: String
    },  
    gender:{
        type: String
    }


}, {collection:'users'});

module.exports = mongoose.model('User', userSchema);
