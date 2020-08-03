const RefreshToken = require('../model/RefreshToken');
const jwt =  require('jsonwebtoken');
const accessTokenExpiresIn = 300;

exports.get_access_token = async function (req, res){
    user = req.body.user_id
    refreshToken = req.body.refreshToken;
    try{
        //Check if token hasn't been expired
        const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if(verified){
            //Check if user had not logged out by checking if db contains the refresh token
            const wasLoggedIn = await RefreshToken.findOne({user_id:user});

            if(wasLoggedIn){
                const token = jwt.sign({ user_id: user }, process.env.TOKEN_SECRET, {expiresIn:accessTokenExpiresIn});
                res.status(200).send({token:token});
                next();
            }
            else{
                res.status(200).json({"success": true, "message":"Need to login again"});
            }


           
        }
        else{
            res.status(400).json({"success": false, "message":"Invalid " + err});
        }

    }
    catch (err) {
        res.status(400).json({"success": false, "message":"Invalid " + err});
    }
    
};
