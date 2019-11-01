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

    methods() {
        let self = this;
        return {
            getRole : async function(mainRole){
                return self.listRole(mainRole);
            },
            checkRole : async function(mainRole, role){
                let listRole = await this.getRole(mainRole);
                return self.roleCan(role, listRole);
            }
        }
    }

    listRole(typeRole){
        switch (typeRole) {
            case this.ROLE('ADMIN'):
                return {
                    edit: true,
                    delete: true,
                    stopExam: true,
                    publicExam: true,
                    evaluateExam: true,
                    comment: true,
                    setFeel: true,
                    doExam: false
                }
                break;
            case this.ROLE('EDITOR'):
                return {
                    edit: true,
                    delete: false,
                    stopExam: true,
                    publicExam: true,
                    evaluateExam: true,
                    comment: true,
                    setFeel: true,
                    doExam: false
                }
                break;
            case this.ROLE('NORMAL'):
                return {
                    edit: false,
                    delete: false,
                    stopExam: false,
                    publicExam: false,
                    evaluateExam: false,
                    comment: true,
                    setFeel: true,
                    doExam: true
                }
                break;
            default:
                return {
                    edit: false,
                    delete: false,
                    stopExam: false,
                    publicExam: false,
                    evaluateExam: false,
                    comment: false,
                    setFeel: false,
                    doExam: false
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