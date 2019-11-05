var express = require('express');
var route = express.Router();
var postController = require('../../controller/api/postController')

route.post('/:id/add_comment', postController.addComment);
route.get('/:id/get_comment', postController.getComment);
route.post('/:id/set_feel', postController.setFeel);
route.get('/:id/get_feel', postController.getFeel);

module.exports = route;