var mongoose = require('mongoose');
var schema = mongoose.Schema;
var group_member = schema({
    group_id : [{ type: schema.Types.ObjectId, ref: 'groups' }],
    user_id : [{ type: schema.Types.ObjectId, ref: 'users' }],
    type : Number, // 1: admin, 2: editor, 3: normal
    user_created : [{ type: schema.Types.ObjectId, ref: 'users' }],
    created_at : Date,
    updated_at : Number
}, {collection : 'group_member'});

module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            group_member.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    if (typeof Class['methods'] === 'function') {
        let methods = Class.methods();
        for (let name in methods) {
            group_member.methods[name] = methods[name];
        }
    }
    return mongoose.model('group_member', group_member);
}