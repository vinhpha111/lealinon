var baseModel = require('./base');
var groupMember = require('./index').getInstance('group_member');
class Group extends baseModel {
    constructor(){
        super('groups');
    }

    ROLE(name = null){
        let roleList = {
            ADMIN : 1,
            EDITOR : 2,
            NORMAL : 3,
        }
        if (roleList[name]) {
            return roleList[name]
        }
        return roleList['NORMAL'];
    }

    virtual() {
        return {
        }
    }

    methods() {
        let self = this;
        return {
            getRole : async function(user_id){
                let member = await groupMember.findOne({group_id: this._id, user_id: user_id});
                let typeRole = member ? member.type : null;
                return self.listRole(typeRole);
            },
        }
    }

    listRole(typeRole){
        switch (typeRole) {
            case this.ROLE('ADMIN'):
                return {
                    newPost : true,
                    deleteGroup : true,
                    editGroup : true,
                    deletePost : true,
                    addMember : true,
                    joinGroup : true,
                }
                break;
            case this.ROLE('EDITOR'):
                return {
                    newPost : true,
                    deleteGroup : false,
                    editGroup : false,
                    deletePost : false,
                    addMember : true,
                    joinGroup : true,
                }
                break;
            case this.ROLE('NORMAL'):
                return {
                    newPost : true,
                    deleteGroup : false,
                    editGroup : false,
                    deletePost : false,
                    addMember : false,
                    joinGroup : true,
                }
                break;
            default:
                return {
                    newPost : false,
                    deleteGroup : false,
                    editGroup : false,
                    deletePost : false,
                    addMember : false,
                    joinGroup : false,
                }
                break;
        }
    }

    roleCan(type, listRole){
        return listRole[type] ? true : false; 
    }
}

module.exports = Group;