var baseModel = require('./base');
var ObjectId = require('mongodb').ObjectID;

class GroupMember extends baseModel {
    constructor(){
        super('group_member');
    }

    getMember(groupId){
        let list = this.getModel().find({group_id: groupId}).populate('user_id', '-encrypt_password');
        return list;
    }

    async listGroupByMember(userId){

        let list = await this.getModel().aggregate()
        .lookup({
            from: "groups",
            localField: "group_id",
            foreignField: "_id",
            as: 'group'
        })
        .unwind("group")
        .group({
            _id: "$_id",
            group_id: {
                $first: "$group._id"
            },
            user_id: {
                $first: "$user_id"
            },
            name: {
                $first: "$group.name"
            },
            slug: {
                $first: "$group.slug"
            },
            description: {
                $first: "$group.description"
            },
            status: {
                $first: "$group.status"
            },
            created_at: {
                $first: "$group.created_at"
            }
        })
        .match({
            "user_id": new ObjectId(userId)
        })
        .addFields({
            _id: "$group_id",
            group_id: null,
        })
        .sort({
            created_at: -1,
        });
        return list;
    }
}

module.exports = GroupMember;