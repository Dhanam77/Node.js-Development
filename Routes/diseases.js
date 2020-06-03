const router = require('express').Router();
const Aidisease = require('../model/aidisease');
const verify = require('../VerifyToken');

//Sample route to get a list of all diseases

router.get('/diseases', verify, async (req, res) => {
    const diseases = await Aidisease.find().exec();
    res.json(diseases);
});

module.exports = router;