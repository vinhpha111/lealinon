let app = {};
var model = require('./../../model');
var User = model.getInstance('users');
var friendModel = model.getInstance('user_friend');
var announce = model.getInstance('announces');
var pastDateTime = datetime.create();
var ObjectId = require('mongodb').ObjectID;

app.listFriend = async (req, res) => {
    let listFriend = await friendModel.listFriend(req.user._id);
    return res.json(listFriend);
}

module.exports = app;