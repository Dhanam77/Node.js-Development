const mongoose = require('mongoose');
const  Schema = require('mongoose').Schema;

const refreshTokenSchema = new Schema({

    user_id:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    },
    expireAt:{
        type:Date,
        required:true
    }


});
module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
