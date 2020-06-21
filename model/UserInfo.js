const mongoose = require('mongoose');


const userInfoSchema = new mongoose.Schema({

    basic:{
        type: Array
    },
    medical:{
        type:Array
    }


}, {collection: "userinfo"});

module.exports = mongoose.model('UserInfo', userInfoSchema);