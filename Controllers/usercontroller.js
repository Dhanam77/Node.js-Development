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
/*
    if(name && age){
        const editedUser = await User.findOneAndUpdate({_id:req.params.id}, {$set:{name:req.body.name, age:req.body.age}});
    }
    */
    if(name){
        const editedUser = await User.findOneAndUpdate({_id:req.params.id}, {$set:{name:req.body.name}});

    }
    if(age){
        const editedUser = await User.findOneAndUpdate({_id:req.params.id}, {$set:{age:req.body.age}});

    }

    res.status(200).send("User updated successfully");

};


//Save user data like name, age, gender 
//This endpoint must only be used to add data and not update it
//TO update, use edit profile api 
exports.save_user_data = async(req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    const gender = req.body.gender;

    if(name){
        User.findOneAndUpdate({_id:req.params.id}, {$set:{name:name}}).exec()
    }
    if(age){
        User.findOneAndUpdate({_id:req.params.id}, {$set:{age:age}}).exec()
    }
    if(gender){
        User.findOneAndUpdate({_id:req.params.id}, {$set:{gender:gender}}).exec()
    }

    res.status(200).send("User data saved successfully");

}



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
        type:req.body.type,
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

//Get user's medical conditions
exports.get_medical_conditions = async(req, res) =>{
    await MedicalCondition.find({user_id:req.params.id, is_user:true}).exec()
    .then(user => {
        res.status(200).send(user)
    }).catch( err => res.status(400).send('Error in getting medical conditions ' + err));

}

// Get user's circle
exports.get_user_circle = async(req, res) =>{

    const name = req.body.name;
    const type = req.body.type;

    if(name && type){
        await MedicalCondition.find({user_id:req.params.id, is_user:false, name:name, type:type}).exec()
        .then(circle => res.status(200).json(circle))
        .catch(err => res.status(400).send("Can't fetch " + err));
    }
    else{
        await MedicalCondition.find({user_id:req.params.id, is_user:false}).exec()
        .then(circle => res.status(200).json(circle))
        .catch(err => res.status(400).send("Can't fetch " + err));
    }

    
}

