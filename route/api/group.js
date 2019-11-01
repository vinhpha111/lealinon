var express = require('express');
var route = express.Router();
var groupController = require('../../controller/api/groupController')
var postController = require('../../controller/api/postController')

route.post('/new', require('../../controller/Request/client/group/new'), groupController.new);
route.get('/list_in_sidebar', groupController.listInSidebar);
route.get('/get_by_id/:id', groupController.getById);
route.get('/permission/:id', groupController.getPermission);
route.post('/:id/new_essay', require('../../controller/Request/client/group/newEssay'), postController.addEssay);
route.post('/:id/new_quiz', require('../../controller/Request/client/group/newQuiz'), postController.addQuiz);
route.get('/:id/list_post', postController.getListByGroup);
route.post('/:id/invite_member', groupController.inviteJoinGroup);
route.get('/:id/get_member', groupController.getMember);
route.post('/:id/join_group', groupController.joinGroup);
route.get('/:id/get_member_ask_join', groupController.getMemberAskJoin);
route.post('/:id/accept_join', groupController.acceptJoin);
route.post('/:id/refuse_join', groupController.refuseJoin);
route.delete('/:id/remove_member', groupController.removeFromGroup);

module.exports = route;