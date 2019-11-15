var express = require('express');
var route = express.Router();
var imageController = require('../../controller/api/imageController')

route.post('/upload_in_editor', imageController.uploadInEditor)

module.exports = route;