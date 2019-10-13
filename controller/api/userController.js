var app = {}
var jwt = require('jsonwebtoken');
var model = require('./../../model');
var User = model.getInstance('users');
const {validationResult} = require('express-validator');
datetime = require('node-datetime');
var pastDateTime = datetime.create();

app.current_user = async (req, res) => {
    if (req.user) {
        var user = await User.findOne({_id: req.user._id}, ['_id', 'email']);
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
            { email : new RegExp(str) }
        ]
    }
    let action = {
        limit:10
    }

    let listUser = await User.find(query, ['_id', 'email'], action);
    return res.json(listUser);

}

module.exports = app;