var baseModel = require('./base');

class GroupMember extends baseModel {
    constructor(){
        super('group_member');
    }
}

module.exports = GroupMember;