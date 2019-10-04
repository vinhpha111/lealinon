var app = {}
var Group = require('./../../model/groups');
const {validationResult} = require('express-validator');
datetime = require('node-datetime');
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
    let group = await Group.new(data);
    if (group) {
        return res.send(group);
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
    if (!req.user) {
        return res.status(403).send(null);
    }

    let id = req.params.id;
    let detail = await Group.findOne({_id: id});
    if (!detail) {
        return res.status(404).send(null);
    }
    return res.send(detail);
}

module.exports = app;