const Doctor = require('../model/Doctor.js');
const Question = require('../model/Question.js');
const Answer = require('../model/Answers.js');


//Post a question
exports.post_question = async(req, res) =>{

    const question_string = req.body.question;
    const asked_on_string = Date.now();
    const asked_by_string = req.body.asked_by;

    //Create question object
    const question = new Question({
        question:question_string,
        asked_on:asked_on_string,
        asked_by:asked_by_string
    });

    try{
        //Post the question
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
        //Get questions by type
        Question.find({question:{$regex:type, $options:'i'}}).sort({asked_on:-1}).limit(3).exec()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send('Error in getting questions ' + err));
    }
    else{
        //Get questions by recency
        Question.find().sort({asked_on:-1}).limit(3).exec()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send('Error in getting questions ' + err));
   
    }
};

//Post an answer
exports.post_answer = async(req, res) =>{
        const question = req.body.question;
        const asked_by = req.body.asked_by;
        const answer = req.body.answer;
        const doctor_id = req.body.answered_by;
        
        try{
            //Find the question which is to be answered
            const question_object = await Question.findOne({question:question, asked_by:asked_by});
            if(question_object){
                question_id = question_object._id;
            }
            else{
                res.status(400).send('Cannot find question with given question and asked_by');
            }

            //Find no of answers to the question
            const length = question_object['answers'].length;

            //Only top 3 answers will be in main db
            //Others will be saved in other db
            if(length == 3){
                const answer_obj  = new Answer({
                    doctor_id:doctor_id,
                    question_id:question_id,
                    answer:answer
                });
                answer_obj.save();
            }
            else{
                const answer_obj  = new Answer({
                    doctor_id:doctor_id,
                    question_id:question_id,
                    answer:answer
                });
                question_object['answers'].push(answer_obj);
                question_object['answered_by'].push(doctor_id)


            }
            await question_object.save();
            try{
                let doctor = await Doctor.findOne({doctor_id:doctor_id});    
                if(doctor){              
                    doctor['answers'].push(question_id);
                    await doctor.save();
                    res.status(200).send('Added answer to the question');
                }
                else{
                    doctor = new Doctor({
                        doctor_id: doctor_id,
                        answers:[question_id]
                    });
                    doctor.save();
                    res.status(200).send('Added answer to the question');
                }
            }
            catch(err){
                res.status(400).send('Error posting answer ' + err);
    
            }
        }
        catch(err){
            res.status(400).send('No question found asked by this user ' + err);
        }
    
};

//Route to enable user to edit his question
exports.edit_question = async(req,res) =>{
    const question = req.body.question;
    const newQuestion = req.body.new_question;
    const asked_by = req.body.asked_by;

    try{
        await Question.findOneAndUpdate({question:question, asked_by:asked_by}, {$set:{question:newQuestion}});
        res.status(200).send('Question updated successfully');
    }
    catch(err){
        res.status(400).send('Error updating the question');
    }
         
}

exports.edit_answer = async(req, res) => {
    const question = req.body.question;
    const asked_by = req.body.asked_by;
    const doctor_id = req.body.answered_by;
    const new_answer = req.body.new_answer;

    try{
        const question_obj = await Question.find({question:question, asked_by:asked_by});
        const question_id = question_obj._id;

        try{
            let answer = await Answer.findOne({doctor_id:doctor_id, question_id:question_id});
            if(answer){
                await Answer.findOne({doctor_id:doctor_id, question_id:question_id}, {$set:{answer:new_answer}});
                res.status(200).send('Answer Updated Successfully');
                
            }
            else{
                answer = await Question.findOne({question:question, asked_by:asked_by});
                const answers_array = answer['answers'];
                
                for (var i = 0; i < answers_array.length; i++) {
                if (answers_array[i].doctor_id === doctor_id) {
                    answers_array[i].answer = new_answer;
                    break;
                }
}
            }

        }
        catch(err){
            res.status(400).send('Error in finding answer ' + err);
        }
    }
    catch(err){
        res.status(400).send('Error in finding the question ' + err);
    }

}


//This is used to delete a question
//Can only be deleted by doctor
exports.delete_question = async(req, res) => {
    const question = req.body.question;
    const asked_by = req.body.asked_by;

    try{
        await Question.findOneAndDelete({question:question, asked_by:asked_by});
        res.status(200).send('Question deleted successfully');
    }
    catch(err) {
        res.status(400).send('Error  while deleting the question ' + err);
    }

}