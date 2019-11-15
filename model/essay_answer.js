var baseModel = require('./base');
class essay_answer extends baseModel {
    constructor(){
        super('essay_answer');
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
            checkRole : async function(mainRole, role, userId){
                let listRole = await this.getRole(mainRole, userId);
                return self.roleCan(role, listRole);
            }
        }
    }

    listRole(typeRole, answer, userId){
        let doEssay = true;
        let evaluateExam = true;
        if (userId === answer.user.toString()
            || (typeof(answer.user) === 'object' && userId === answer.user._id.toString())) {
            evaluateExam = false;
        }
        
        switch (typeRole) {
            case this.ROLE('ADMIN'):
                return {
                    view: true,
                    evaluateExam: evaluateExam,
                    doEssay: doEssay,
                }
                break;
            case this.ROLE('EDITOR'):
                return {
                    view: true,
                    evaluateExam: evaluateExam,
                    doEssay: doEssay,
                }
                break;
            case this.ROLE('NORMAL'):
                return {
                    view: true,
                    evaluateExam: evaluateExam,
                    doEssay: doEssay,
                }
                break;
            default:
                return {
                    view: false,
                    evaluateExam: false,
                    doEssay: false,
                }
                break;
        }
    }

    roleCan(type, listRole){
        return listRole[type] ? true : false; 
    }
}

module.exports = essay_answer;