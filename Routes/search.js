const router = require('express').Router();
const CommonSymptoms = require('../model/CommonSymptoms');

router.get('/search', async (req, res) =>{

    const text = req.body.text;
    await CommonSymptoms.find({'Complaint':{ $regex: text, $options: "i" }})
       .exec()
       .then(data => res.status(200).send(data))
       .catch(err => res.status(400).send('Error in getting search results ' + err));



});

module.exports = router;

