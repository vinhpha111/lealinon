var express = require('express');
var route = express.Router();
var postController = require('../../controller/api/postController')
var validCommon = require('../../controller/Request/client/common');

route.post('/:id/add_comment', postController.addComment);
route.get('/:id/get_comment', postController.getComment);
route.post('/:id/set_feel', postController.setFeel);
route.get('/:id/get_feel', postController.getFeel);

route.get('/:id/get_essay', validCommon, postController.getDetailEssay);
route.post('/:id/add_essay_answer', 
    validCommon.concat(require('../../controller/Request/client/post/addEssay')),
    postController.addEssayAnswer);

module.exports = route;