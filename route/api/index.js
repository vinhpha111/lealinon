var express = require('express');
var route = express.Router();
var auth = require('../../controller/middleware/authController');

route.use(auth);

route.use('/group', require('./group.js'));

route.use('/user', require('./user.js'));

route.use('/chat', require('./chat.js'));

route.use('/search', require('./search.js'));

route.use('/announce', require('./announce.js'));

route.use('/image', require('./image.js'));

route.use('/post', require('./post.js'));

route.all('/*', (req, res) => {
    res.status(404);
    res.json({'message': 'not found'});
});

module.exports = route;