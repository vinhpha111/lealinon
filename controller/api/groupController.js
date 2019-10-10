var app = {}
var model = require('./../../model');
var Group = model.getInstance('groups');
var groupMemberModel = model.getInstance('group_member');
const {validationResult} = require('express-validator');
var datetime = require('node-datetime');
var pastDateTime = datetime.create();

app.new = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors : errors.array() })
    }

    let data = {
        user_created : req.user._id,
        name : req.body.name,
        description: req.body.description,
        slug : convertToSlug(req.body.name)
    }
    let group = await Group.add(data);

    let newMember = await groupMemberModel.add({
        group_id: group._id,
        user_id: req.user._id,
        type: Group.ROLE('ADMIN'),
        user_created: req.user._id,
    });
    if (group && newMember) {
        return res.send([]);
    }
    return res.send(null, 500);
}

app.listInSidebar = async (req, res) => {
    if (!req.user) {
        return res.status(403).send(null);
    }

    let list = await Group.find({user_created: req.user._id});
    return res.json(list)
}

app.getById = async (req, res) => {
    io.sockets.in("room").emit('connectToRoom', "You are in group page");
    let id = req.params.id;
    let detail = await Group.findOne({_id: id});
    if (!detail) {
        return res.status(404).send(null);
    }
    let data = detail.toJSON();
    data.role = await detail.getRole(req.user ? req.user._id : null);
    return res.json(data);
}

app.inviteJoinGroup = async (req, res) => {
    let groupInviteJoin = model.getInstance('group_invite_join');
    let announce = model.getInstance('announces');
    let userIds = req.body.ids;
    let dataInvites = [];
    let dataAnnounces = [];
    for(let i in userIds){
        dataInvites.push({
            group_id : req.params.id,
            user_id : req.user._id,
            invited_users : userIds[i],
            message : req.body.introduce,
            created_at : pastDateTime.now(),
            updated_at : pastDateTime.now(),
        });

        dataAnnounces.push({
            user_id : userIds[i],
            type : announce.TYPE('INVITED_JOIN_GROUP'),
            group_id : req.params.id,
            sender : req.user._id,
            created_at : pastDateTime.now(),
            updated_at : pastDateTime.now(),
        })
    }
    let invites = await groupInviteJoin.insertMany(dataInvites);
    if (invites) {
        let announces = await announce.insertMany(dataAnnounces);
        for(let i in announces){
            io.sockets.in(announces[i].user_id).emit('announce', announces[i]);
        }
        return res.send(announces);
    }
    return res.status(500).send(null);
}

app.getPermission = async (req, res) => {
    if (!req.user) {
        return res.status(403).send(null);
    }
    let id = req.params.id;
    let role = await groupMemberModel.findOne({group_id: id, user_id: req.user._id});
    res.json({roles: [role ? role.type : null]});
}

module.exports = app;