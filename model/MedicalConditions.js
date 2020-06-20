const mongoose = require('mongoose')
const Schema = require('mongoose').Schema;

const medicalConditionSchema = new Schema({
    user_id : {
        required: true,
        type: String
    },
    is_user: {
        type:Boolean,
        required : true
    },
    type: {
        type:String,
        required: true
    },
    name: {
        type:String
    },
    age: {
        type:String
    },
    gender: {
        type:String
    },
    smoker: {
        type:String,
    },
    diabetic: {
        type:String,
    },
    blood_pressure: {
        type:String,
    }
})

module.exports = mongoose.model('MedicalCondition', medicalConditionSchema);