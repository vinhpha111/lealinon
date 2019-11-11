var baseModel = require('./base');
var datetime = require('node-datetime');
var pastDateTime = datetime.create();
var ObjectId = require('mongodb').ObjectID;
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
            getRole : async function(mainRole, userId){
                return self.listRole(mainRole, this, userId);
            },
            checkRole : async function(mainRole, role){
                let listRole = await this.getRole(mainRole);
                return self.roleCan(role, listRole);
            }
        }
    }

    listRole(typeRole, post, userId){
        let doExam = true;
        let doEssay = true;
        let doQuiz = true;
        let setNotify = false;
        if (post.start_at && post.end_at) {
            let startTime = (new Date(post.start_at)).getTime();
            let endTime = (new Date(post.end_at)).getTime();
            let nowTime = pastDateTime.now();
            if (nowTime - endTime > 0 || startTime - nowTime > 0 || post.has_stop) {
                doExam = false;
                doEssay = false;
                doQuiz = false;
            }
            if (startTime - nowTime > 0) {
                setNotify = true;   
            }
        }
        if (userId === post.user_created || post.type === this.TYPE('ANNOUNCE')) {
            doExam = false;
            doEssay = false;
            doQuiz = false;
            setNotify = false;
        }
        if (post.type === this.TYPE('ESSAY')) doQuiz = false;
        if (post.type === this.TYPE('QUIZ')) doEssay = false;

        let management = false;
        if (typeRole === this.ROLE('ADMIN') || post.user_created === userId) {
            management = true;
        }
        
        switch (typeRole) {
            case this.ROLE('ADMIN'):
                return {
                    view: true,
                    management : management,
                    viewListAnswer: true,
                    edit: true,
                    delete: true,
                    stopExam: true,
                    publicExam: true,
                    evaluateExam: true,
                    comment: true,
                    setFeel: true,
                    doEssay: doEssay,
                    doQuiz: doQuiz,
                    setNotify: setNotify,
                }
                break;
            case this.ROLE('EDITOR'):
                return {
                    view: true,
                    management : management,
                    viewListAnswer: true,
                    edit: true,
                    delete: false,
                    stopExam: true,
                    publicExam: true,
                    evaluateExam: true,
                    comment: true,
                    setFeel: true,
                    doEssay: doEssay,
                    doQuiz: doQuiz,
                    setNotify: setNotify,
                }
                break;
            case this.ROLE('NORMAL'):
                return {
                    view: true,
                    management : management,
                    viewListAnswer: false,
                    edit: false,
                    delete: false,
                    stopExam: false,
                    publicExam: false,
                    evaluateExam: false,
                    comment: true,
                    setFeel: true,
                    doEssay: doEssay,
                    doQuiz: doQuiz,
                    setNotify: setNotify,
                }
                break;
            default:
                return {
                    view: false,
                    management : false,
                    viewListAnswer: false,
                    edit: false,
                    delete: false,
                    stopExam: false,
                    publicExam: false,
                    evaluateExam: false,
                    comment: false,
                    setFeel: false,
                    doEssay: false,
                    doQuiz: false,
                    setNotify: false,
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

    async getGroupByPost(postId) {
        let post = await this.getModel().findOne({_id: new ObjectId(postId)}).populate('group');
        if (post) {
            return post.group;
        }
        return null;
    }

}

module.exports = postGroup;