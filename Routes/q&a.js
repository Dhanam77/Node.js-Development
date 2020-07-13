const router = require('express').Router();
const QAController = require('../Controllers/q&acontroller');


//This route is used to post a question
router.post('/question', QAController.post_question);

//This route is used to edit a question
router.patch('/question', QAController.edit_question);

//This route is used to delete a question
//Can only be deleted by doctor
router.delete('/question', QAController.delete_question);


//This route is used to post an answer to a question
router.post('/answer', QAController.post_answer);

//This route is used to post an answer to a question
router.patch('/answer', QAController.edit_answer);

//This route is used to delete an answer to a question
router.delete('/answer', QAController.delete_answer);

//This route is used to get recently asked questions or questions by type when Q&A is accessed
router.get('/questions', QAController.get_questions);



module.exports = router;
