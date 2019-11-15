var baseModel = require('./base');
var ObjectId = require('mongodb').ObjectID;
class comments extends baseModel {
    constructor(){
        super('comments');
    }

    async listCommentByPost(postId, filter = {}) {
        let exceptIds = filter.exceptIds ? filter.exceptIds : [];
        for(let i in exceptIds) {
            exceptIds[i] = new ObjectId(exceptIds[i]);
        }
        let list = await this.getModel().aggregate()
        .lookup({
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
        })
        .unwind("user")
        .match({
            post : new ObjectId(postId),
            _id : {
                $nin: exceptIds
            }
        })
        .sort({
            created_at: -1,
        })
        .limit(10);
        return list;
    }

    async detailById(id) {
        let list = await this.getModel().aggregate()
        .lookup({
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
        })
        .unwind("user")
        .match({
            _id : new ObjectId(id)
        })
        .limit(1);
        if (list.length > 0) {
            return list[0];
        }
        return null;
    }
}

module.exports = comments;