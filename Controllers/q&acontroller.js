const Doctor = require('../model/Doctor');
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
        Question.find({question:{$regex:type, $options:'i'}}).sort({asked_on:-1}).exec()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send('Error in getting questions ' + err));
    }
    else{
        Question.find().sort({asked_on:-1}).exec()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send('Error in getting questions ' + err));
   
    }
};

//Post a answer
exports.post_answer = async(req, res) =>{
        const question = req.body.question;
        const asked_by = req.body.asked_by;
        const answer = req.body.answer;
        const doctor_id = req.params.id;
        
        try{
            const question_object = await Question.findOne({question:question, asked_by:asked_by});
            question_id = question_object._id;
            console.log(question_object.answers.length);
            question_object['answers'].push(answer);
            question_object['answered_by'].push(doctor_id)
            question_object.save();
            try{
                let doctor = await Doctor.findOne({doctor_id:doctor_id});    
                if(doctor){              
                    doctor['answers'].push(question_id);
                    await doctor.save();
                    res.status(200).send('Added question_id to doctors list');
                }
                else{
                    doctor = new Doctor({
                        doctor_id: doctor_id,
                        answers:[question_id]
                    });
                    doctor.save();
                    res.status(200).send('New entry for doctor saved');
                }
            }
            catch(err){
                res.status(400).send('Error posting answer ' + err);
    
            }
    
    
        }
        catch(err){
            res.status(400).send('Error posting answer ' + err);
        }
    
};
