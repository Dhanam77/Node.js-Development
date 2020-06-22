const jwt =  require('jsonwebtoken');
const router = require('express').Router();
const accessTokenExpiresIn = 300;

//This endpoint is used to get new access token after it has expired
router.get('/refresh', (req, res) => {
    user = req.body.user_id
    refreshToken = req.body.refreshToken;
    try{
        const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if(verified){
            const token = jwt.sign({ user_id: user }, process.env.TOKEN_SECRET, {expiresIn:accessTokenExpiresIn});
            res.status(200).send({token:token});
            next();
        }
        else{
            res.status(400).send('Invalid ' + err);
        }

    }
    catch (err) {
        res.status(400).send('Invalid Refresh Token ' + err);
    }
    
})
module.exports = router

