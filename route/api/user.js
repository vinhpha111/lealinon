var express = require('express');
var route = express.Router();
var userController = require('../../controller/api/userController')
var commonValid = require('../../controller/Request/client/common')

route.get('/find', userController.find);
route.get('/find_to_invite_join_group', commonValid, userController.findToInviteJoinGroup);
route.get('/get_by_id/:id', commonValid, userController.getById);
route.post('/:id/edit', require('../../controller/Request/client/user/edit'), userController.edit);
route.post('/:id/invite_make_friend', userController.inviteMakeFriend);
route.post('/:id/accept_make_friend', userController.acceptMakeFriend);
route.get('/current_user', userController.current_user);

module.exports = route;