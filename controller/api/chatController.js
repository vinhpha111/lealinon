let app = {};
var model = require('./../../model');
var User = model.getInstance('users');
var friendModel = model.getInstance('user_friend');
var messageModel = model.getInstance('chat_messages');
var announceMessageModel = model.getInstance('announce_message');
var pastDateTime = datetime.create();
var ObjectId = require('mongodb').ObjectID;

app.listFriend = async (req, res) => {
    let listFriend = await friendModel.listFriend(req.user._id);
    return res.json(listFriend);
}

app.listMessage = async (req, res) => {
    if (!req.user) {
        return res.status(403).send(null);
    }
    let listMessage = await messageModel.listMessage(req.user._id, req.params.id);
    res.json(listMessage);
}

app.addMessage = async (req, res) => {
    if (!req.user) {
        return res.status(403).send(null);
    }
    let message = await messageModel.add({
        from: req.user._id,
        to: req.params.id,
        message: req.body.message,
        created_at : pastDateTime.now(),
        updated_at : pastDateTime.now(),
    });
    io.sockets.in(req.params.id).emit('message_user_'+req.user._id, message);
    let announce = await announceMessageModel.add({
        user_id: req.params.id,
        type: announceMessageModel.TYPE('NEW_MESSAGE'),
        sender: req.user._id,
        created_at : pastDateTime.now(),
        updated_at : pastDateTime.now(),
    });
    io.sockets.in(req.params.id).emit('announceMessage', announce);
    return res.send(null);
}

module.exports = app;