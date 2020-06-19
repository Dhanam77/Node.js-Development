const UserInfo = require('../model/UserInfo');
const User = require('../model/User');
const MedicalCondition = require('../model/MedicalConditions');

//Get pre diagnosis questions
exports.get_userinfo =  async(req, res) => {

    const user = await User.findById(req.params.id);
    const gender = user.gender;
    const age = user.age;

   const userinfo = await UserInfo.findOne().exec();

   res.status(200).json(userinfo);

};


//Edit a specific profile function
//Can edit only name and age
exports.edit_profile = async(req, res) => {

    const name = req.body.name;
    const age = req.body.age;

    if(name && age){
        const editedUser = await User.findOneAndUpdate({_id:req.params.id}, {$set:{name:req.body.name, age:req.body.age}});
    }
    else if(name){
        const editedUser = await User.findOneAndUpdate({_id:req.params.id}, {$set:{name:req.body.name}});

    }
    else if(age){
        const editedUser = await User.findOneAndUpdate({_id:req.params.id}, {$set:{age:req.body.age}});

    }

    res.status(200).send("User updated successfully");

};


//Get a specific profile
exports.get_profile = async (req, res) => {

    const user = await User.findOne({_id:req.params.id});
    res.status(200).json(user);

};

//Get all users
exports.get_user = async(req, res) => {
    const users = await User.find().exec();
    res.status(200).json(users);
};

//Set user's medical condition
exports.set_medical_condition = async(req, res) => {
    const condition = new MedicalCondition({
        user_id : req.params.id,
        is_user : req.body.is_user,
        name: req.body.name,
        age: req.body.age,
        gender:req.body.gender,
        smoker:req.body.smoker,
        diabetic:req.body.diabetic,
        blood_pressure:req.body.blood_pressure
    });

    try {
        await condition.save();
        res.status(200).send('Medical condition saved');

    } catch (err) {
        res.status(400).send(err);
        console.log("Error in saving medical condition " + err);
    }

}