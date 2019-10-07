var app = {}
var model = require('./../../model');
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
    let Group = model.getInstance('groups');
    let group = await Group.add(data);
    let groupMemberModel = model.getInstance('group_member');
    let newMember = await groupMemberModel.add({
        group_id: group._id,
        user_id: req.user._id,
        type: 1,
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

    Group = model.getInstance('groups');
    let list = await Group.find({user_created: req.user._id});
    return res.json(list)
}

app.getById = async (req, res) => {
    if (!req.user) {
        return res.status(403).send(null);
    }

    Group = model.getInstance('groups');
    let id = req.params.id;
    let detail = await Group.findOne({_id: id});
    if (!detail) {
        return res.status(404).send(null);
    }
    return res.send(detail);
}

app.addEssay = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors : errors.array() })
    }
    res.send(req.body);
}

module.exports = app;