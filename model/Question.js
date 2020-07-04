const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({

    question:{
        type:String,
        required: true
    },
    
    answers:{
        type:Array
    },
    asked_by:{
        type:String,
        required:true
    },
    answered_by:{
        type:Array
    },
    asked_on:{
        type:Date,
        required:true
    },
    answered_on:{
        type:Date
    },
    type:{
        type:String
    }



},{collection:"questions"});

module.exports = mongoose.model('Question', questionSchema);