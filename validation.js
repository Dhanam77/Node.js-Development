//Joi library used to validate user entered data
const Joi = require('@hapi/joi');


//VALIDATION


//Register validation schema

//Only Email and Password are necessary for normal auth.
//For google auth, we're saving name and email

const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6),
        state: Joi.string(),
        city: Joi.string()
    });

    return schema.validate(data);
};


//Login Validation schema

//Here email and password are necessary to login

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;

