var app = {};
var datetime = require('node-datetime');
var pastDateTime = datetime.create();
var model = require('../../model');
var Post = model.getInstance('post_groups');
var Group = model.getInstance('groups');
var quizModel = model.getInstance('quiz_exams');
var quizListModel = model.getInstance('quiz_lists');
var commentModel = model.getInstance('comments');
var announceModel = model.getInstance('announces');
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

app.addQuiz = async (req, res) => {
    let postData = {
        user_created : req.user._id,
        title : req.body.title,
        content : req.body.content,
        type : Post.TYPE('QUIZ'),
        group : req.params.id,
        created_at : pastDateTime.now(),
        updated_at : pastDateTime.now(),
    }
    if (req.body.setTime) {
        postData.start_at = req.body.startDate;
        postData.end_at = req.body.endDate;
    }
    let post = new (Post.getModel())(postData); // not save

    let listQuestion = req.body.questions;
    let questions = [];
    for(let i in listQuestion) {
        let question = {};
        let quiz = new (quizModel.getModel())({
            user_created : req.user._id,
            post : post._id,
            content : listQuestion[i].description,
            result : listQuestion[i].correctAnswer,
            created_at : pastDateTime.now(),
            updated_at : pastDateTime.now(),
        });
        question.quiz = quiz;

        let answerList = [];
        for(let num = 1; num <= 4; num++) {
            answerList.push(new (quizListModel.getModel())({
                quiz_exam : quiz._id,
                number_sort : num,
                content : listQuestion[i]['contentAnswer'+num],
                created_at : pastDateTime.now(),
                updated_at : pastDateTime.now(),
            }))
        }

        question.answerList = answerList;

        questions.push(question);
    }

    await post.save();
    if (questions.length > 0) {
        for (let i in questions) {
            questions[i].quiz.save();
            let answerList = questions[i].answerList;
            for(let num in answerList) {
                await answerList[num].save();
            }
        }
    }

    return res.send(post);
}

app.getListByGroup = async (req, res) => {
    console.log('time start: '+pastDateTime.now());
    let groupId = req.params.id;
    let exceptIds = req.query.exceptIds;
    let group = await Group.getModel().findOne({_id: groupId});
    let userId = req.user ? req.user._id : null;
    
    if (!group || ! await group.checkRole(userId, 'listPost')) {
        return res.status(403).send(null);
    }
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
    let listPost = await Post.getModel().find(query, null, action).populate('user_created');

    let datas = [];
    for(let i in listPost) {
        datas[i] = listPost[i].toJSON();
        datas[i].role = await listPost[i].getRole(await group.roleInGroup(userId), userId);
        // datas[i].comments = await commentModel.listCommentByPost(datas[i]._id);
    }
    console.log('time end: '+pastDateTime.now());
    res.send(datas);
}

app.addComment = async (req, res) => {
    if (!req.user) {
        return res.status(403).send(null);
    }

    let data = {
        post : req.params.id,
        user : req.user._id,
        content : req.body.content,
        created_at : pastDateTime.now(),
        updated_at : pastDateTime.now(),
    }

    let comment = await commentModel.getModel().create(data);
    let detail = await commentModel.detailById(comment._id);
    let group = await Post.getGroupByPost(req.params.id);
    io.sockets.to('group_'+(group ? group._id : null)).emit('comment_post_'+req.params.id,detail);
    return res.json(detail);
}

app.getComment = async (req, res) => {
    let exceptIds = req.query.exceptIds;
    let filter = {
        exceptIds: exceptIds
    }
    let comments = await commentModel.listCommentByPost(req.params.id, filter);
    return res.json(comments);
}

module.exports = app;