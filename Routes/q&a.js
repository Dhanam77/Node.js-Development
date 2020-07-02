const router = require('mongoose').Router();
const QAController = require('../Controllers/q&acontroller');

//This route is used to post a question
//Here ID corresponds to user_id
router.post('/question/:id', QAController.post_question);


//This route is used to post an answer to a question
//Here ID corresponds to Question_id
router.post('/answer/:id', async(req, res) =>{

});


