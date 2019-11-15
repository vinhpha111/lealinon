var express = require('express');
var route = express.Router();
var searchController = require('../../controller/api/searchController')

route.get('/by_string', searchController.searchByString);

module.exports = route;