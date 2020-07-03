const Question = require('../model/Question.js');

//Post a question
exports.post_question = async(req, res) =>{

    const question_string = req.body.question;
    const asked_on_string = Date.now();
    const asked_by_string = req.params.id;

    const question = new Question({
        question:question_string,
        asked_on:asked_on_string,
        asked_by:asked_by_string
    });
    try{
        await question.save();
        res.status(200).send('Question posted');

    }
    catch(err){
            res.status(400).send('Error in posting question ' + err);
    }
    


};

//Get questions by type and/or by recency
exports.get_questions = async(req, res) =>{
    const type = req.body.type;
    if(type){
        Question.find({regex:type}).sort({asked_by:-1}).exec()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send('Error in getting questions ' + err));
    }
    else{
        Question.find().sort({asked_by:-1}).exec()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send('Error in getting questions ' + err));
   
    }
};

//Post a answer
exports.post_answer = async(req, res) => {
    
};
