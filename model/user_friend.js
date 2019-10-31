var baseModel = require('./base');
var ObjectId = require('mongodb').ObjectID;
class userFriend extends baseModel {
    constructor(){
        super('user_friend');
    }

    listFriend(userId) {
        let list = this.getModel().aggregate()
        .lookup({
            from: 'users',
            localField: 'friend',
            foreignField: '_id',
            as: 'friend'
        })
        .unwind('friend')
        .match({
            user: new ObjectId(userId)
        })
        .group({
            _id: '$_id',
            friend_id: {
                $first: "$friend._id"
            },
            name: {
                $first: "$friend.name"
            },
            email: {
                $first: "$friend.email"
            },
            avatar_path: {
                $first: "$friend.avatar_path"
            },
            introduce: {
                $first: "$friend.introduce"
            },
            online_status: {
                $first: "$friend.online_status"
            },
            created_at: {
                $first: "$created_at"
            },
        })
        .addFields({
            _id: "$friend_id",
            friend_id: null,
        })
        .sort({
            created_at: -1,
        });
        return list;
    }
}

module.exports = userFriend;