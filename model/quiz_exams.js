var baseModel = require('./base');
var ObjectId = require('mongodb').ObjectID;
class quiz_exams extends baseModel {
    constructor(){
        super('quiz_exams');
    }

    async getListQuizQuestion(postId) {
        let list = await this.getModel().aggregate()
        .lookup({
            from: 'quiz_lists',
            localField: '_id',
            foreignField: 'quiz_exam',
            as: 'options'
        })
        .project({
            result: 0
        })
        .match({
            post: new ObjectId(postId)
        })
        .exec();
        return list;
    }
}

module.exports = quiz_exams;