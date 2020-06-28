const mongoose = require('mongoose');

const commonSymptomsSchema = new mongoose.Schema({

    "Complaint":{
        type: String
    }
},{collection:'commonSymptoms'});

commonSymptomsSchema.index({Complaint: 'text'});

module.exports  = mongoose.model('CommonSymptoms', commonSymptomsSchema);