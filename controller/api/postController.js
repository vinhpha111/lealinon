var app = {};
var datetime = require('node-datetime');
var pastDateTime = datetime.create();
var Post = require('../../model').getInstance('post_groups');
app.addEssay = async (req, res) => {
    let data = {
        user_created : req.user._id,
        title : req.body.title,
        content : req.body.content,
        type : Post.TYPE('ESSAY'),
        group : req.params.id,
        created_at : pastDateTime.now(),
        updated_at : pastDateTime.now(),
    }
    if (req.body.setTime) {
        data.start_at = req.body.startDate;
        data.end_at = req.body.endDate;
    }

    let addEssay = await Post.add(data);
    
    if (addEssay) {
        return res.json(addEssay);
    }

    return res.status(500).send('Has error!');
}

app.addQuiz = (req, res) => {
    return res.send('dfsdf')
}

app.getListByGroup = async (req, res) => {
    let groupId = req.params.id;
    let exceptIds = req.query.exceptIds;
    let query = {
        group : groupId,
        _id : {
            $nin : exceptIds
        }
    }
    let action = {
        limit:10,
        sort:{
            created_at: -1 //Sort by Date Added DESC
        }
    }
    let listPost = await Post.find(query, null, action);
    res.send(listPost);
}

module.exports = app;