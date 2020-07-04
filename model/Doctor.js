const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    doctor_id:{
        type:String,
        required:true
    },
    answers:{
        type: Array
    }

}, {collection:'doctors'});

module.exports = mongoose.model('Doctor', doctorSchema);