var express = require('express');
var route = express.Router();
var userController = require('../controller/api/userController')

route.get('/current_user', userController.current_user);


route.all('/*', (req, res) => {
    res.status(404);
    res.json({'message': 'not found'});
});

module.exports = route;