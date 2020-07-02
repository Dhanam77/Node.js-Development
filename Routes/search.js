const router = require('express').Router();
const CommonSymptoms = require('../model/CommonSymptoms');


//Route to get search results
//Currently limiting searches to only 5
//Regex gives partial search 
//$search gives full text search
router.get('/search', async (req, res) =>{

    const text = req.body.text;
    await CommonSymptoms.find({'Complaint':{ $regex: text, $options: "i" }})
        .limit(5)
       .exec()
       .then(data => res.status(200).send(data))
       .catch(err => res.status(400).send('Error in getting search results ' + err));

});




module.exports = router;

