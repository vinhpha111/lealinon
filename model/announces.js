var baseModel = require('./base');
var model = require('./index');
class announce extends baseModel {
    constructor(){
        super('announces');
    }
    
    TYPE(name){
        switch (name) {
            case 'INVITED_JOIN_GROUP':
            return 1;
            break;
            case 'INVITED_MAKE_FRIEND':
            return 2;
            break;
            case 'ACCEPTED_MAKE_FRIEND':
            return 3;
            break;
            case 'REFUSED_MAKE_FRIEND':
            return 4;
            break;
            case 'HAS_ONE_COMMENT_IN_POST':
            return 5;
            break;
            case 'HAS_ONE_COMMENT_IN_GROUP':
            return 6;
            break;
            case 'HAS_MESSAGE':
            return 7;
            break;
            case 'HAS_FEEL_IN_POST':
            return 8;
            break;
            
            default:
            return null;
            break;
        }
    }

    virtual(){
        return {
            check_see : {
                get: function(){
                    return this.has_see;
                },
                set: function(value){
                    this.has_see = value;
                }
            }
        }
    }
}

module.exports = announce;