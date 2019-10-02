var Group = require('./schema/groups');
module.exports = {
    new : (data) => {
        return new Promise((resolve, reject)=>{
            let group = new Group(data);
            group.save((err) => {
                if (err) reject(err);
                resolve(group);
            })
        })
    },

    find : (query, field_select) => {
        return new Promise((resolve, reject) => {
            Group.find(query, field_select, (err, groups) => {
                if (err) reject(err);
                resolve(groups);
            })
        });
    },
}