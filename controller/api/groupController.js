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
        return res.send(null, 403);
    }

    let list = await Group.find({user_created: req.user._id}, null);
    return res.json(list)
}

module.exports = app;