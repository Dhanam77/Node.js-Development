const router = require('express').Router();
const User = require('../model/User');
const verify = require('../VerifyToken');

//Sample route to get a list of all users

router.get('/users',verify, async(req, res) => {
    console.log('Getting user list');
    const users = await User.find().exec();
    res.json(users);
});



module.exports = router;