var mongoose = require('mongoose');
var schema = mongoose.Schema;
var announce_message = schema({
    user_id : { type: schema.Types.ObjectId, ref: 'users' },
    // 1: has new message,
    type : Number,
    sender : { type: schema.Types.ObjectId, ref: 'users' },
    message : String,
    has_see : { type: Boolean, default: false },
    created_at : Date,
    updated_at : Date
}, {collection : 'announce_message'});

module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            announce_message.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    if (typeof Class['methods'] === 'function') {
        let methods = Class.methods();
        for (let name in methods) {
            announce_message.methods[name] = methods[name];
        }
    }
    if (typeof Class['postMiddleware'] === 'function') {
        let postMiddlewares = Class.postMiddleware();
        for (let type in postMiddlewares) {
            announce_message.post(type, postMiddlewares[type]);
        }
    }
    return mongoose.model('announce_message', announce_message);
}