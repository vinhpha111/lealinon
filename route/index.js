var express = require('express');
var route = express.Router();
var apiRoute = require('./api/index.js');
var webRoute = require('./web.js');

route.get('/timezone', (req, res) => res.send(Intl.DateTimeFormat().resolvedOptions().timeZone))

route.use('/api', apiRoute);
route.use('/', webRoute);

module.exports = route;