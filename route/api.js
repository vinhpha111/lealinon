var express = require('express');
var route = express.Router();
var userController = require('../controller/api/userController')
var groupController = require('../controller/api/groupController')

route.get('/current_user', userController.current_user);

route.post('/group/new', require('../controller/Request/client/group/new'), groupController.new);
route.get('/group/list_in_sidebar', groupController.listInSidebar);
route.get('/group/get_by_id/:id', groupController.getById);


route.all('/*', (req, res) => {
    res.status(404);
    res.json({'message': 'not found'});
});

module.exports = route;