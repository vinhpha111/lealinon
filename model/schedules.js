var baseModel = require('./base');
var model = require('./index');
class schedules extends baseModel {
    constructor(){
        super('schedules');
    }
}

module.exports = schedules;