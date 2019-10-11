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

app.getAnnounce = async (req, res) => {
    if (!req.user) return res.status(403).send("Unauthorized!");
    let announce = model.getInstance('announces');
    let exceptIds = req.query.exceptIds;
    let checkSee = req.query.checkSee;
    let limit = req.query.limit ? req.query.limit : 10;
    let query = {
        user_id: req.user._id,
        _id: {
            $nin: exceptIds
        }
    }
    let action = {
        limit: limit,
        sort: {
            has_see: 1,
            created_at: -1
        }
    }
    let listAnnounce = await announce.model.find(query, null, action).populate('sender', '-encrypt_password');
    if(checkSee){
        let idsHasSee = [];
        for(let i in listAnnounce){
            if (!listAnnounce[i].has_see) {
                idsHasSee.push(listAnnounce[i]._id);
                listAnnounce[i].has_see = true;   
            }
        }
        if (idsHasSee.length > 0) {
            await announce.model.updateMany({_id:{"$in": idsHasSee}}, {has_see: true});
        }
    }
    return res.json(listAnnounce);
}

module.exports = app;