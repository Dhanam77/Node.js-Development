const UserInfo = require('../model/UserInfo');
const User = require('../model/User');

exports.get_userinfo =  async(req, res) => {

    const user = await User.findById(req.params.id);
    const gender = user.gender;
    const age = user.age;

   // const userinfo = await UserInfo.findOne().exec();

   res.json(userinfo);

};

