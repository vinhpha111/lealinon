var express = require('express');
var route = express.Router();
var chatController = require('../../controller/api/chatController')

route.get('/list_friend', chatController.listFriend);
route.get('/user/:id/list_message', chatController.listMessage);
route.post('/user/:id/add_message', chatController.addMessage);

module.exports = route;