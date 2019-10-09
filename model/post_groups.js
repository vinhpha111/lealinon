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

}

module.exports = postGroup;