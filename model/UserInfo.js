const mongoose = require('mongoose');


const userInfoSchema = new mongoose.Schema({

    questions:{
        type: Array
    }


}, {collection: "userinfo"});

module.exports = mongoose.model('UserInfo', userInfoSchema);