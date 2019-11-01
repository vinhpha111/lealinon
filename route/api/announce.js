var express = require('express');
var route = express.Router();
var announceController = require('../../controller/api/announceController')

route.get('/find', announceController.getAnnounce);
route.get('/get_not_see', announceController.getAnnounceNotSee);
route.put('/set_has_see', announceController.setAnnounceHasSee);
route.get('/get_announce_message', announceController.getAnnounceMessage);
route.get('/get_announce_message_not_see', announceController.getAnnounceMessageNotSee);
route.put('/set_announce_message_has_see', announceController.setAnnounceMessageHasSee);
route.delete('/delete_announce_message', announceController.deleteAnnounceMessage);

module.exports = route;