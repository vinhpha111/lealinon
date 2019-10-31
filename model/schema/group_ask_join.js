var mongoose = require('mongoose');
var schema = mongoose.Schema;
var group_ask_join = schema({
    group_id : { type: schema.Types.ObjectId, ref: 'groups' },
    user_id : { type: schema.Types.ObjectId, ref: 'users' },
    message : String,
    created_at : Date,
    updated_at : Date
}, {collection : 'group_ask_join'});

module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            group_ask_join.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    if (typeof Class['methods'] === 'function') {
        let methods = Class.methods();
        for (let name in methods) {
            group_ask_join.methods[name] = methods[name];
        }
    }
    return mongoose.model('group_ask_join', group_ask_join);
}