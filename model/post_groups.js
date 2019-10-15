var baseModel = require('./base');
class postGroup extends baseModel {
    constructor(){
        super('post_groups');
    }

    TYPE(name){
        switch (name) {
            case 'ESSAY':
                return 1;
                break;
            case 'QUIZ':
                return 2;
                break;
            case 'ANNOUNCE':
                return 3;
                break;
            default:
                return 3;
                break;
        }
    }

    findByString(query){
        let list = this.getModel().aggregate()
        .lookup({
            from: 'users',
            localField: 'user_created',
            foreignField: '_id',
            as: 'user_created'
        })
        .project({
            user_created: {
                encrypt_password: 0
            }
        })
        .lookup({
            from: 'groups',
            localField: 'group',
            foreignField: '_id',
            as: 'group'
        })
        .match({
            $or: [
                { title: new RegExp(query.string) },
                { content: new RegExp(query.string) },
            ],
            _id: {
                $nin: query.exceptIds
            }
        })
        .sort({'created_at': 'desc'})
        .project({
            _id: 1,
            title: 1,
            content: 1,
            type: 1,
            start_at: 1,
            end_at: 1,
            created_at: 1,
            updated_at: 1,
            user_created: 1,
            group: 1,
            table: "post"
        })
        .limit(10)
        .exec();
        return list;
    }

}

module.exports = postGroup;