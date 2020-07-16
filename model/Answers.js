const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    question_id:{
        type:String,
        required:true
    },
    doctor_id:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    },
    from_load_more:{
        type:Boolean,
        required:true
    }
});

module.exports = mongoose.model('Answer', answerSchema);