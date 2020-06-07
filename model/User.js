const mongoose = require('mongoose');


//Only Email and Password are necessary. 

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
    state: {
        type: String
    },
    city: {
        type: String
    },
    phoneNumber: {
        type: String
    }


}, {collection:'users'});

module.exports = mongoose.model('User', userSchema);
