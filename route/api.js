var express = require('express');
var route = express.Router();
var userController = require('../controller/api/userController')
var groupController = require('../controller/api/groupController')
var postController = require('../controller/api/postController')
var announceController = require('../controller/api/announceController')
var searchController = require('../controller/api/searchController')

route.get('/current_user', userController.current_user);

route.post('/group/new', require('../controller/Request/client/group/new'), groupController.new);
route.get('/group/list_in_sidebar', groupController.listInSidebar);
route.get('/group/get_by_id/:id', groupController.getById);
route.get('/group/permission/:id', groupController.getPermission);
route.post('/group/:id/new_essay', require('../controller/Request/client/group/newEssay'), postController.addEssay);
route.get('/group/:id/list_post', postController.getListByGroup);
route.post('/group/:id/invite_member', groupController.inviteJoinGroup);

route.get('/user/find', userController.find);

route.get('/search/by_string', searchController.searchByString);

// announce
route.get('/announce/find', announceController.getAnnounce);
route.get('/announce/get_not_see', announceController.getAnnounceNotSee);
route.put('/announce/set_has_see', announceController.setAnnounceHasSee);

route.all('/*', (req, res) => {
    res.status(404);
    res.json({'message': 'not found'});
});

module.exports = route;