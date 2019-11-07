var express = require('express');
var route = express.Router();
var userController = require('../controller/userController');
var homeController = require('../controller/homeController');

route.get('/login', userController.get_login);
route.post('/login', userController.post_login);

route.get('/register', userController.get_register);
route.post('/register', require('../controller/Request/client/user/register'), userController.post_register);

route.get('/user/active', userController.active);

route.get('/test-seo', (req, res) => {
    res.render('app', {
        htmlSeo: "<h1>this is page test seo</h1>"
    })
})

route.post('/login_facebook', userController.login_facebook)

route.get('/*', homeController.index);

module.exports = route;