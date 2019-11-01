var baseModel = require('./base');
var groupMember = require('./index').getInstance('group_member');
var groupAskJoin = require('./index').getInstance('group_ask_join');
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
        return null;
    }

    virtual() {
        return {
        }
    }

    methods() {
        let self = this;
        return {
            roleInGroup : async function(user_id) {
                let member = await groupMember.findOne({group_id: this._id, user_id: user_id});
                let typeRole = member ? member.type : null;
                return typeRole;
            },
            getRole : async function(user_id){
                let member = await groupMember.findOne({group_id: this._id, user_id: user_id});
                let typeRole = member ? member.type : null;
                let listRole = self.listRole(typeRole, this);
                let askJoin = await groupAskJoin.getModel().findOne({group_id: this._id, user_id: user_id});
                if (askJoin) {
                    listRole.hasAskJoin = true;
                }
                return listRole;
            },
            checkRole : async function(user_id, role){
                let listRole = await this.getRole(user_id);
                return self.roleCan(role, listRole);
            }
        }
    }

    listRole(typeRole, group = null){
        switch (typeRole) {
            case this.ROLE('ADMIN'):
                return {
                    newPost : true,
                    listPost: true,
                    deleteGroup : true,
                    editGroup : true,
                    deletePost : true,
                    addMember : true,
                    listMember: true,
                    deleteMember: true,
                    canRemoveFromGroup: false,
                    setRole: true,
                    joinGroup : true,
                    hasAskJoin : true,
                }
                break;
            case this.ROLE('EDITOR'):
                return {
                    newPost : true,
                    listPost: true,
                    deleteGroup : false,
                    editGroup : false,
                    deletePost : false,
                    addMember : true,
                    listMember: true,
                    deleteMember: false,
                    canRemoveFromGroup: true,
                    setRole: false,
                    joinGroup : true,
                    hasAskJoin : true,
                }
                break;
            case this.ROLE('NORMAL'):
                return {
                    newPost : false,
                    listPost: true,
                    deleteGroup : false,
                    editGroup : false,
                    deletePost : false,
                    addMember : false,
                    listMember: true,
                    deleteMember: false,
                    canRemoveFromGroup: true,
                    setRole: false,
                    joinGroup : true,
                    hasAskJoin : true,
                }
                break;
            default:
                return {
                    newPost : false,
                    listPost: group ? (group.status !== 2 ? true : false) : false,
                    deleteGroup : false,
                    editGroup : false,
                    deletePost : false,
                    addMember : false,
                    listMember: false,
                    deleteMember: false,
                    canRemoveFromGroup: false,
                    setRole: false,
                    joinGroup : false,
                    hasAskJoin : false,
                }
                break;
        }
    }

    roleCan(type, listRole){
        return listRole[type] ? true : false; 
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
        .match({
            $or: [
                { name: new RegExp(query.string) },
                { description: new RegExp(query.string) },
            ],
            _id: {
                $nin: query.exceptIds,
            }
        })
        .sort({'created_at': 'desc'})
        .project({
            _id: 1,
            name: 1,
            slug: 1,
            description: 1,
            created_at: 1,
            status: 1,
            user_created: 1,
            table: "group"
        })
        .limit(10)
        .exec();
        return list;
    }
}

module.exports = Group;