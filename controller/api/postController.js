var app = {};
var datetime = require('node-datetime');
var pastDateTime = datetime.create();
var model = require('../../model');
var Post = model.getInstance('post_groups');
var Group = model.getInstance('groups');
var quizModel = model.getInstance('quiz_exams');
var quizListModel = model.getInstance('quiz_lists');
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
    if (! await group.checkRole(req.user, 'listPost')) {
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
    res.send(listPost);
}

module.exports = app;