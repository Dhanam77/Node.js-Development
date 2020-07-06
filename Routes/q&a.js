const router = require('express').Router();
const QAController = require('../Controllers/q&acontroller');


//This route is used to post a question
//Here ID corresponds to user_id
router.post('/question/:id', QAController.post_question);

//This route is used to edit a question
//Here ID corresponds to user_id
router.post('/question/edit/:id', QAController.edit_question);

//This route is used to delete a question
//Can only be deleted by doctor
router.post('/question/delete/:id', QAController.delete_question);


//This route is used to post an answer to a question
//Here ID corresponds to Doctor_ID
router.post('/answer/:id', QAController.post_answer);

//This route is used to post an answer to a question
//Here ID corresponds to Doctor_ID
router.post('/answer/:id', QAController.edit_answer);

//This route is used to get recently asked questions or questions by type when Q&A is accessed
router.get('/questions', QAController.get_questions);

module.exports = router;
