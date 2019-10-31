var baseModel = require('./base');
var ObjectId = require('mongodb').ObjectID;
class groupAskJoin extends baseModel {
    constructor(){
        super('group_ask_join');
    }

    async getMemberAskJoin(group_id){
        let list = await this.getModel().aggregate()
        .lookup({
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'member'
        })
        .unwind('member')
        .match({
            group_id: new ObjectId(group_id)
        })
        .group({
            _id: '$_id',
            member_id: {
                $first: "$member._id"
            },
            email: {
                $first: "$member.email"
            },
            name: {
                $first: "$member.name"
            },
            gender: {
                $first: "$member.gender"
            },
            birthday: {
                $first: "$member.birthday"
            },
            job: {
                $first: "$member.job"
            },
            introduce: {
                $first: "$member.introduce"
            },
            online_status: {
                $first: "$member.online_status"
            },
        })
        .addFields({
            _id: "$member_id",
            member_id: null
        });
        return list;
    }
}

module.exports = groupAskJoin;