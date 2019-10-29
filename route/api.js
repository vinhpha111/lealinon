var express = require('express');
var route = express.Router();
var userController = require('../controller/api/userController')
var groupController = require('../controller/api/groupController')
var postController = require('../controller/api/postController')
var announceController = require('../controller/api/announceController')
var searchController = require('../controller/api/searchController')
var imageController = require('../controller/api/imageController')

var chatController = require('../controller/api/chatController')

route.get('/current_user', userController.current_user);

route.post('/group/new', require('../controller/Request/client/group/new'), groupController.new);
route.get('/group/list_in_sidebar', groupController.listInSidebar);
route.get('/group/get_by_id/:id', groupController.getById);
route.get('/group/permission/:id', groupController.getPermission);
route.post('/group/:id/new_essay', require('../controller/Request/client/group/newEssay'), postController.addEssay);
route.post('/group/:id/new_quiz', require('../controller/Request/client/group/newQuiz'), postController.addQuiz);
route.get('/group/:id/list_post', postController.getListByGroup);
route.post('/group/:id/invite_member', groupController.inviteJoinGroup);
route.get('/group/:id/get_member', groupController.getMember);
route.post('/group/:id/join_group', groupController.joinGroup);
route.get('/group/:id/get_member_ask_join', groupController.getMemberAskJoin);
route.post('/group/:id/accept_join', groupController.acceptJoin);
route.post('/group/:id/refuse_join', groupController.refuseJoin);
route.delete('/group/:id/remove_member', groupController.removeFromGroup);

route.get('/user/find', userController.find);
route.get('/user/get_by_id/:id', userController.getById);
route.post('/user/:id/edit', require('../controller/Request/client/user/edit'), userController.edit);
route.post('/user/:id/invite_make_friend', userController.inviteMakeFriend);
route.post('/user/:id/accept_make_friend', userController.acceptMakeFriend);

route.get('/chat/list_friend', chatController.listFriend);
route.get('/chat/user/:id/list_message', chatController.listMessage);

route.get('/search/by_string', searchController.searchByString);

// announce
route.get('/announce/find', announceController.getAnnounce);
route.get('/announce/get_not_see', announceController.getAnnounceNotSee);
route.put('/announce/set_has_see', announceController.setAnnounceHasSee);
route.get('/announce/get_announce_message', announceController.getAnnounceMessage);
route.get('/announce/get_announce_message_not_see', announceController.getAnnounceMessageNotSee);
route.put('/announce/set_announce_message_has_see', announceController.setAnnounceMessageHasSee);

route.post('/image/upload_in_editor', imageController.uploadInEditor)

route.all('/*', (req, res) => {
    res.status(404);
    res.json({'message': 'not found'});
});

module.exports = route;