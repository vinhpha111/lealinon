var baseModel = require('./base');
var model = require('./index');
class announce_message extends baseModel {
    constructor(){
        super('announce_message');
    }
    
    TYPE(name){
        switch (name) {
            case 'NEW_MESSAGE':
            return 1;
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

module.exports = announce_message;