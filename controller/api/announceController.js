var app = {}
var model = require('./../../model');
var announce = model.getInstance('announces');

app.getAnnounce = async (req, res) => {
    if (!req.user) return res.status(403).send("Unauthorized!");
    let exceptIds = req.query.exceptIds;
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
    let listAnnounce = await announce.getModel().find(query, null, action).populate('sender', '-encrypt_password').populate('group_id');
    
    return res.json(listAnnounce);
}

app.getAnnounceNotSee = async function(req, res){
    if (!req.user) return res.status(403).send("Unauthorized!");
    let count = await announce.getModel().countDocuments({user_id: req.user._id, has_see: false});
    return res.json({countNotSee: count});
}

app.setAnnounceHasSee = async function(req, res){
    if (!req.user) return res.status(403).send("Unauthorized!");
    let ids = req.body.ids;
    await announce.getModel().updateMany({_id: { $in: ids}}, {has_see: true});
    res.status(200).send(null);
}

module.exports = app;