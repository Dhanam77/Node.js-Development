const router = require('express').Router();
const RefreshController = require('../Controllers/refreshcontroller');
const VerifyToken = require('../VerifyToken')

//This endpoint is used to get new access token after it has expired
router.get('/refresh', VerifyToken,RefreshController.get_access_token);



/*
router.get('/refresh/reject', async(req,res) =>{

    const user = req.body.user;
    
    try{
        await RefreshToken.remove({user_id:user});
        res.status(200).send('Rejected the refresh token successfully');

    }
    catch(err){
        res.status(400).send('Error rejecting the refresh token ' + err);
    }



});

*/
module.exports = router

