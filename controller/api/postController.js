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
var essayAnserModel = model.getInstance('essay_answer');
var feelModel = model.getInstance('feels');
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
    let groupId = req.params.id;
    let exceptIds = req.query.exceptIds;
    let group = await Group.getModel().findOne({_id: groupId});
    let userId = req.user ? req.user._id : null;
    
    if (!group || ! await group.checkRole(userId, 'listPost')) {
        return res.status(403);
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
    res.send(datas);
}

app.addComment = async (req, res) => {
    if (!req.user) {
        return res.status(403).send(null);
    }
    let group = await Post.getGroupByPost(req.params.id);
    let post = await Post.getModel().findOne({_id: req.params.id});
    if (!group || ! await post.checkRole(await group.roleInGroup(req.user._id), 'comment')) {
        return res.send(403);
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

app.setFeel = async (req, res) => {
    if (!req.user) {
        return res.status(403).send(null);
    }
    let postId = req.params.id;
    let type = req.body.type;

    let feel = await feelModel.getModel().findOne({
        post: postId,
        user: req.user._id,
        feel_type: type,
    });
    let group = await Post.getGroupByPost(postId);
    if (feel) {
        io.sockets.to('group_'+(group ? group._id : null)).emit('remove_feel_post_'+postId, feel);
        feel.remove();
    } else {
        let oldFeels = await feelModel.getModel().find({
            post: postId,
            user: req.user._id
        });
        for(let i in oldFeels) {
            io.sockets.to('group_'+(group ? group._id : null)).emit('remove_feel_post_'+postId, oldFeels[i]);
        }
        await feelModel.getModel().deleteMany({
            post: postId,
            user: req.user._id
        });
        feel = await feelModel.getModel().create({
            post: postId,
            user: req.user._id,
            feel_type: type,
            created_at : pastDateTime.now(),
            updated_at : pastDateTime.now(),
        });
        io.sockets.to('group_'+(group ? group._id : null)).emit('add_feel_post_'+postId, feel);
    }
    return res.json(feel);
}

app.getFeel = async function(req, res) {
    let postId = req.params.id;
    let user_id = req.user ? req.user._id : null;
    let detail = await Post.getModel().findOne({_id: postId});
    let group = await Post.getGroupByPost(req.params.id);
    if (!group || ! await detail.checkRole(await group.roleInGroup(user_id), 'view')) {
        return res.status(403);
    }
    let data = {};
    data.countLike = await feelModel.getModel().countDocuments({
        post: postId,
        feel_type: 1,
    });
    data.countUnlike = await feelModel.getModel().countDocuments({
        post: postId,
        feel_type: 2,
    });
    if (user_id) {
        let hasLike = await feelModel.getModel().countDocuments({
            post : postId,
            feel_type : 1,
            user : user_id,
        });
        data.hasLike = hasLike > 0;
        let hasUnlike = await feelModel.getModel().countDocuments({
            post : postId,
            feel_type : 2,
            user : user_id,
        });
        data.hasUnlike = hasUnlike > 0;   
    }
    return res.json(data);
}

app.getDetailEssay = async (req, res) => {
    let detail = await Post.getModel().findOne({_id: req.params.id, type: Post.TYPE('ESSAY')});
    let data = null;
    let group = await Post.getGroupByPost(req.params.id);
    let userId = req.user ? req.user._id : null;
    if (!group || ! await detail.checkRole(await group.roleInGroup(userId), 'doEssay')) {
        return res.status(403);
    }
    if (detail && req.user && group) {
        data = detail.toJSON();
        let answer = await essayAnserModel.getModel().findOne({post: detail._id, user: req.user._id});
        data.answer = answer;
        data.role = await detail.getRole(await group.roleInGroup(req.user._id), req.user._id);
    }
    if (data) {
        return res.json(data);
    }
    return res.status(404).send();
}

app.addEssayAnswer = async (req, res) => {
    let userId = req.user._id;
    let postId = req.params.id;
    let content = req.body.content;
    let isDraft = req.body.isDraft;
    let id = req.body._id;
    let group = await Post.getGroupByPost(postId);
    let post = await Post.getModel().findOne({_id: postId});
    if (!post) return res.status(404).send(null);
    if (!group || ! await post.checkRole(await group.roleInGroup(userId), 'doEssay')) {
        return res.status(403).send(null);
    }

    if (id) {
        let answer = await essayAnserModel.getModel().findOne({_id: id, user: userId, is_draft: true});
        if (answer) {
            answer.content = content;
            answer.post = postId;
            answer.is_draft = isDraft;
            answer.updated_at = pastDateTime.now();
            await answer.save();
            return res.json(answer);
        }
    }

    let existAnswer =  await essayAnserModel.getModel().findOne({post : postId, user: userId, is_draft: false});
    if (existAnswer) {
        return res.status(422).json({
            errors: [{
                param: 'has_exist',
                msg: 'Bạn đã gửi câu trả lời trước đó'
            }]
        });
    }


    let answer = await essayAnserModel.getModel().create({
        content : content,
        user : userId,
        post : postId,
        is_draft : isDraft,
        created_at : pastDateTime.now(),
        updated_at : pastDateTime.now(),
    });
    return res.json(answer);
}

module.exports = app;