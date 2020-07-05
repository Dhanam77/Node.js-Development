const router = require('express').Router();
const QAController = require('../Controllers/q&acontroller');


//This route is used to post a question
//Here ID corresponds to user_id
router.post('/question/:id', QAController.post_question);

router.post('/question/edit/:id', QAController.edit_question);


//This route is used to post an answer to a question
//Here ID corresponds to Question_id
router.post('/answer/:id', QAController.post_answer);

//This route is used to get recently asked questions or questions by type when Q&A is accessed
router.get('/questions', QAController.get_questions);

module.exports = router;
