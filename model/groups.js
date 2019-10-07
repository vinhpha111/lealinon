/* var Group = require('./schema/groups');
module.exports = {
    new : (data) => {
        return new Promise((resolve, reject)=>{
            let group = new Group(data);
            group.save((err) => {
                if (err) resolve(null);
                resolve(group);
            })
        })
    },

    find : (query, field_select = null) => {
        return new Promise((resolve, reject) => {
            Group.find(query, field_select, (err, groups) => {
                if (err) resolve(null);
                resolve(groups);
            })
        });
    },

    findOne : (query, field_select = null) => {
        return new Promise((resolve, reject) => {
            Group.findOne(query, field_select, (err, group) => {
                if (err) {
                    resolve(null);
                }
                resolve(group);
            })
        });
    },
} */
var baseModel = require('./base');
class Group extends baseModel {
    constructor(){
        super('groups');
    }

    virtual() {
        return {
            getname : {
                get: function(){
                    return this.name + " this is virtual";
                }
            }
        }
    }
}

module.exports = Group;