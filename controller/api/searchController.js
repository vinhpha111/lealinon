var app = {};
var model = require('./../../model');
var groupModel = model.getInstance('groups');
var userModel = model.getInstance('users');
var postModel = model.getInstance('post_groups');
var datetime = require('node-datetime');
var ObjectId = require('mongodb').ObjectID;

app.searchByString = async (req, res) => {
    if (!req.user) {
        return res.status(403).send(null);
    }

    let string = req.query.string;
    if (string.length == 0) {
        return res.json([]);
    }
    let exceptIds = req.query.exceptIds ? req.query.exceptIds : [];
    exceptIds = exceptIds.map((id) => new ObjectId(id));
    let type = 'all';
    if (['group', 'user', 'post'].indexOf(req.query.type) !== -1) {
        type = req.query.type;
    }
    let query = {
        string: string,
        exceptIds: exceptIds
    }

    let groupList = [];
    let userList = [];
    let postList = [];
    if (type === 'group' || type ==='all') {
        groupList = await groupModel.findByString(query);
    }
    if(type === 'user' || type ==='all'){
        userList = await userModel.findByString(query);
    }
    if(type === 'post' || type ==='all'){
        postList = await postModel.findByString(query);
    }
    let data = groupList.concat(userList).concat(postList);
    let dataSort = data.sort(function(first, second){
        if(datetime.create(first.created_at).getTime() > datetime.create(second.created_at).getTime()){
            return 1;
        }
        if(datetime.create(first.created_at).getTime() < datetime.create(second.created_at).getTime()){
            return -1;
        }
        return 0;
    })
    let dataLimit = dataSort.slice(0, 10);
    res.json(dataLimit);
}

module.exports = app;