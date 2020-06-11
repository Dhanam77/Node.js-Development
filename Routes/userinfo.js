const router = require('express').Router();
const UserInfo = require('../model/UserInfo.js');
const User = require('../model/User.js');
const UserController = require('../Controllers/userinfocontroller');


router.get('/userinfo/:id', UserController.get_userinfo);
module.exports = router;