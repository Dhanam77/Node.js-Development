const Question = require('../model/Question');

//Post a question
exports.post_question = async(req, res) =>{

    const question_string = req.body.question;
    const asked_on_string = Date.now();
    const asked_by_string = req.params.id;

    const question = new Question({
        question:question_string,
        asked_on:asked_on_string,
        asked_by_string:asked_by_string
    });

    await Question.save(question).exec()
    .then(data => {
        res.status(200).send('Question Posted');
    })
    .catch(err => {
        res.status(400).send('Error saving the question '+ err);
    })

};

//Post a answer
exports.post_question = async(req, res) => {

};
