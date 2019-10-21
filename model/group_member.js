var baseModel = require('./base');

class GroupMember extends baseModel {
    constructor(){
        super('group_member');
    }

    getMember(groupId){
        let list = this.getModel().find({group_id: groupId}).populate('user_id', '-encrypt_password');
        return list;
    }

    async listGroupByMember(userId){
        let list = await this.getModel()
        .find({
            user_id: userId
        })
        .populate("group_id");

        let groups = [];
        for(let index in list){
            groups.push(list[index].group_id);
        }

        return groups;
    }
}

module.exports = GroupMember;