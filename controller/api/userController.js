var app = {}
var jwt = require('jsonwebtoken');
var model = require('./../../model');
var User = model.getInstance('users');
var inviteMakeFriendModel = model.getInstance('user_invite_make_friend');
var friendModel = model.getInstance('user_friend');
var groupMemberModel = model.getInstance('group_member');
var announce = model.getInstance('announces');
const {validationResult} = require('express-validator');
datetime = require('node-datetime');
var pastDateTime = datetime.create();
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');

app.current_user = async (req, res) => {
    if (req.user) {
        var user = await User.findOne({_id: req.user._id});
        if (!user) return res.status(403).send();
        return res.status(200).send(user);
    }
    return res.status(403).send();
}

app.find = async (req, res) => {
    if (!req.user) return res.status(404).send("Not found!");
    
    let str = req.query.string;
    if (!str) return res.send([]);
    
    let query = {
        $or : [
            { email : new RegExp(str) },
            { name : new RegExp(str) }
        ]
    }
    let action = {
        limit:10
    }
    
    let listUser = await User.find(query, null, action);
    return res.json(listUser);
}

app.findToInviteJoinGroup = async (req, res) => {
    if (!req.user) return res.status(404).send("Not found!");
    
    let str = req.query.string;
    let groupId = req.query.groupId;
    if (!str || !groupId) {
        return res.send([]);
    }

    let listMember = await groupMemberModel.getModel().find({group_id: groupId});
    let exceptIds = listMember.map(item => item.user_id);
    let query = {
        $or : [
            { email : new RegExp(str) },
            { name : new RegExp(str) }
        ],
        _id : {
            $nin: exceptIds
        }
    }
    let action = {
        limit:10
    }
    let listUser = await User.find(query, null, action);
    return res.json(listUser);
}

app.getById = async (req, res) => {
    let id = req.params.id;
    let user = await User.getModel().findOne({_id: id});
    if (!user) {
        return res.status(404).send(null);
    }
    let data = user.toJSON();
    data.roles = await user.getRole(req.user ? req.user._id : null);
    return res.json(data);
}

app.edit = async (req, res) => {
    let dataUpdate = {
        name: req.body.name,
        introduce: req.body.introduce
    }
    if (req.avatarPath) {
        dataUpdate.avatar_path = req.avatarPath;
    }
    
    await User.getModel().updateOne({_id: req.params.id}, dataUpdate);
    
    
    return res.send(null);
}

app.inviteMakeFriend = async (req, res) => {
    let userId = req.params.id;
    let user = await User.getModel().findOne({_id: userId});
    if (!user) {
        return res.status(404).send(null);
    }
    if (!req.user || ! await user.checkRole(req.user._id, 'inviteMakeFriend')) {
        return res.status(403).send(null);
    }
    let data = {
        user: req.user._id,
        user_invited: userId,
        created_at: pastDateTime.now(),
        updated_at: pastDateTime.now(),
    }
    let inviteMakeFriend = await inviteMakeFriendModel.add(data);
    let announceAdd = await announce.add({
        user_id: userId,
        type: announce.TYPE('INVITED_MAKE_FRIEND'),
        sender: req.user._id,
        created_at : pastDateTime.now(),
        updated_at : pastDateTime.now(),
    });
    io.sockets.in(userId).emit('announceHeader', announceAdd);
    return res.json(inviteMakeFriend);
}

app.acceptMakeFriend = async (req, res) => {
    let userId = req.params.id;
    let user = await User.getModel().findOne({_id: userId});
    if (!user) {
        return res.status(404).send(null);
    }
    if (!req.user || ! await user.checkRole(req.user._id, 'isSenderMakeFriend')) {
        return res.status(403).send(null);
    }

    let dataInsert = [
        {
            user: req.user._id,
            friend: userId,
            created_at : pastDateTime.now(),
            updated_at : pastDateTime.now(),
        }, {
            user: userId,
            friend: req.user._id,
            created_at : pastDateTime.now(),
            updated_at : pastDateTime.now(),
        }
    ]
    await friendModel.getModel().insertMany(dataInsert);
    await inviteMakeFriendModel.getModel().deleteOne({
        user: userId,
        user_invited: req.user._id
    });
    let announceAdd = await announce.add({
        user_id: userId,
        type: announce.TYPE('ACCEPTED_MAKE_FRIEND'),
        sender: req.user._id,
        created_at : pastDateTime.now(),
        updated_at : pastDateTime.now(),
    });
    io.sockets.in(userId).emit('announceHeader', announceAdd);
    return res.send(null);
}

module.exports = app;