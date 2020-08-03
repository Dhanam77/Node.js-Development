const Doctor = require('../model/Doctor.js');
const Question = require('../model/Question.js');
const Answer = require('../model/Answers.js');


//Post a question
exports.post_question = async function (req, res) {

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
        res.status(400).json({"success": true, "message":"Question posted"});

    }
    catch(err){
        res.status(400).json({"success": false, "message":"Error in posting question " + err});
    }
};

//Get questions by type and/or by recency
exports.get_questions = async function (req, res) {
    const type = req.body.type;
    if(type){
        //Get questions by type
        Question.find({question:{$regex:type, $options:'i'}}).sort({asked_on:-1}).limit(3).exec()
        .then(data => res.status(200).send(data))
        res.status(400).json({"success": false, "message":"Error in getting question " + err});
    }
    else{
        //Get questions by recency
        Question.find().sort({asked_on:-1}).limit(3).exec()
        .then(data => res.status(200).send(data))
        res.status(400).json({"success": false, "message":"Error in getting question " + err});
   
    }
};

//Post an answer
exports.post_answer = async function (req, res) {

        //Question and asked_by is used to find question_id
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
                res.status(400).json({"success": false, "message":"Cannot find question " + err});
            }

            //Find no of answers to the question
            const length = question_object['answers'].length;

            //Only top 3 answers will be in main db
            //Others will be saved in other db
            if(length == 3){
                const answer_obj  = new Answer({
                    doctor_id:doctor_id,
                    question_id:question_id,
                    answer:answer,
                    from_load_more:true
                });
                answer_obj.save();

            }
            else{
                const answer_obj  = new Answer({
                    doctor_id:doctor_id,
                    question_id:question_id,
                    answer:answer,
                    from_load_more:false
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
                    res.status(200).json({"success": true, "message":"Posted answer"});
                }
                else{
                    doctor = new Doctor({
                        doctor_id: doctor_id,
                        answers:[question_id]
                    });
                    doctor.save();
                    res.status(200).json({"success": true, "message":"Posted answer"});
                }
            }
            catch(err){
                res.status(400).json({"success": false, "message":"Error posting answer"});
    
            }
        }
        catch(err){
            res.status(400).json({"success": false, "message":"Question not found " + err});
        }
    
};

//Route to enable user to edit his question
exports.edit_question = async function (req, res) {
    const question = req.body.question;
    const newQuestion = req.body.new_question;
    const asked_by = req.body.asked_by;

    try{
        await Question.findOneAndUpdate({question:question, asked_by:asked_by}, {$set:{question:newQuestion}});
        res.status(200).json({"success": true, "message":"Edited answer"});
    }
    catch(err){
        res.status(400).json({"success": false, "message":"Error " + err});
    }
         
}

exports.edit_answer = async function (req, res) {
    const question = req.body.question;
    const asked_by = req.body.asked_by;
    const doctor_id = req.body.answered_by;
    const new_answer = req.body.new_answer;

   
    try{
        //Find question id of the answer to be deleted
        const question_obj = await Question.findOne({question:question, asked_by:asked_by});
        const question_id = question_obj._id;

         //First find answer in questions_db
        //If not there, we'll find in answers_db
            
        try{
            //Find the question holding the answer
            let question_obj = await Question.findById({_id:question_id});
            var answers_array = question_obj['answers'];                                
            let i = -1
            i = answers_array.findIndex(function(item, i){
                return item.doctor_id === doctor_id
              });

            if(i != -1){
              answers_array[i]['answer'] = new_answer;
                const updated = await Question.findByIdAndUpdate({_id:question_id}, {$set:{answers:answers_array}});     
    
                if(updated){
                    res.status(200).json({"success": true, "message":"Updated answer"});
                } 
                else{
                    res.status(400).json({"success": false, "message":"Error " + err});
                }
            } else{
                let answer = await Answer.findOne({doctor_id:doctor_id, question_id:question_id});
                console.log(doctor_id);
                console.log(question_id);
    
                //Answer found in answers_database
                if(answer){
                    await Answer.findOneAndUpdate({doctor_id:doctor_id, question_id:question_id}, {$set:{answer:new_answer}});
                    res.status(200).json({"success": true, "message":"Updated answer"});
                    
                } 
                else{
                    res.status(400).json({"success": false, "message":"Error in finding answer"});

                }
                
            }

        }
        catch(err){
            res.status(400).json({"success": false, "message":"Error in finding question " + err});

        }
    }
    catch(err){
        res.status(400).json({"success": false, "message":"Error in finding question " + err});
    }

}


//This is used to delete a question
//Can only be deleted by doctor
exports.delete_question = async function (req, res) {
    const question = req.body.question;
    const asked_by = req.body.asked_by;

    try{
        await Question.findOneAndDelete({question:question, asked_by:asked_by});
        res.status(200).json({"success": true, "message":"Question deleted"});
    }
    catch(err) {
        res.status(400).json({"success": false, "message":"Error in deleting question " + err});
    }


}

exports.delete_answer = async function (req, res) {
    const question = req.body.question;
    const asked_by = req.body.asked_by;
    const doctor_id = req.body.answered_by;

    try{
        //Find question id of the answer to be deleted
        const question_obj = await Question.findOne({question:question, asked_by:asked_by});
        const question_id = question_obj._id;

         //First find answer in questions_db
        //If not there, we'll find in answers_db
            
        try{
            //Find the question holding the answer
            let question_obj = await Question.findById({_id:question_id});
            var answers_array = question_obj['answers'];                                
            let i = -1
            i = answers_array.findIndex(function(item, i){
                return item.doctor_id === doctor_id
              });

            if(i != -1){
                answers_array.splice(i, 1);
                const updated = await Question.findByIdAndUpdate({_id:question_id}, {$set:{answers:answers_array}});     
    
                if(updated){
                    res.status(200).json({"success": true, "message":"Deleted answer"});
                } 
                else{
                    res.status(400).json({"success": false, "message":"Error in deleting question"});
                }
            } else{
                let answer = await Answer.findOne({doctor_id:doctor_id, question_id:question_id});
                console.log(doctor_id);
                console.log(question_id);
    
                //Answer found in answers_database
                if(answer){
                    await Answer.findOneAndDelete({doctor_id:doctor_id, question_id:question_id});
                    res.status(200).json({"success": true, "message":"Deleted answer"});
                    
                } 
                else{
                    res.status(400).json({"success": false, "message":"Error in deleting question"});

                }
                
            }

        }
        catch(err){
            res.status(400).json({"success": false, "message":"Error in deleting question"});

        }
    }
    catch(err){
        res.status(400).json({"success": false, "message":"Error in deleting question"});
    }

}