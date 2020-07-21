const router = require('express').Router();
const User = require('../model/User');
const doctor = 'doctor';

//Route to test whether a user is doctor or not
router.get('/doctor/:id', async function (req, res) {
    const id = req.params.id;

    try{
        const user = await User.findOne({_id:id, type:doctor});
        if(user){
            res.status(200).json({doctor:true})
        }
        else{
            res.status(200).json({doctor:false})
         }
    }
    catch(err){
        res.status(400).send('Error getting type of user' + err);
    }
})


//Route to make the user a doctor
router.post('/doctor/:id', async function (req, res)  {
    const id = req.params.id;

    
        await User.findOneAndUpdate({_id:id}, {$set:{type:doctor}}, {upsert:true}).exec()
        .then(data => {
            res.status(200).send('Upgraded user to doctor');
        }).catch(err => {
            res.status(400).send('Error '  + err);
        });

   

})


module.exports = router;