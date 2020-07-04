const router = require('express').Router();
const QAController = require('../Controllers/q&acontroller');
const Doctor = require('../model/Doctor');
const Question = require('../model/Question.js');



//This route is used to post a question
//Here ID corresponds to user_id
router.post('/question/:id', QAController.post_question);


//This route is used to post an answer to a question
//Here ID corresponds to Question_id
router.post('/answer/:id', async(req, res) =>{
    const question = req.body.question;
    const asked_by = req.body.asked_by;
    const answer = req.body.answer;
    const doctor_id = req.params.id;
    
    try{
        const question_object = await Question.findOne({question:question, asked_by:asked_by});
        question_id = question_object._id;
        
        question_object['answers'].push(answer);
        question_object['answered_by'].push(doctor_id)
        question_object.save();
        try{
            let doctor = await Doctor.findOne({doctor_id:doctor_id});
            console.log('doctor is ' + doctor);

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
    
});

module.exports = router;
