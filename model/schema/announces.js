var mongoose = require('mongoose');
var schema = mongoose.Schema;
var announces = schema({
    user_id : { type: schema.Types.ObjectId, ref: 'users' },
    // 1: invite join group, 2: invite make friend, 3: is accepted make friend, 4: is refused make friend
    // 5: has one comment in post, 6: has one comment in group
    // 7: has message, 8: has one send feel in post
    type : Number,
    group_id : { type: schema.Types.ObjectId, ref: 'groups' },
    sender : { type: schema.Types.ObjectId, ref: 'users' },
    message : String,
    has_see : { type: Boolean, default: false },
    created_at : Date,
    updated_at : Date
}, {collection : 'announces'});

module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            announces.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    if (typeof Class['methods'] === 'function') {
        let methods = Class.methods();
        for (let name in methods) {
            announces.methods[name] = methods[name];
        }
    }
    if (typeof Class['postMiddleware'] === 'function') {
        let postMiddlewares = Class.postMiddleware();
        for (let type in postMiddlewares) {
            announces.post(type, postMiddlewares[type]);
        }
    }
    return mongoose.model('announces', announces);
}