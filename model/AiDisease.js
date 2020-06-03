const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    Speciality: {
        type: String
    },
    Disease: {
        type: String
    },
    Anatomy1: {
        type: String
    },
    Anatomy2: {
        type: String
    },
    Anatomy3: {
        type: String
    },
    Anatomy4: {
        type: String
    },
    Anatomy5: {
        type: String
    },
    Anatomy6: {
        type: String
    },
	S1: {
		type:String
    },
    S2: {
        type: String
    },
    S3: {
        type: String
    },
    S4: {
        type: String
    },
    S5: {
        type: String

    },
    S6: {
        type: String
    },
    S7: {
        type: String
    },
    S8: {
        type: String
    },
    S9: {
        type: String
    },
    S10: {
        type: String

    },
    S11: {
        type: String
    },
    S12: {
        type: String
    },
    S13: {
        type: String
    },
    S14: {
        type: String
    },
    S15: {
        type: String
    },

}, {collection:'aidisease'});

module.exports = mongoose.model('aidisease', schema);