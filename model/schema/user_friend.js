var mongoose = require('mongoose');
var schema = mongoose.Schema;
var user_friend = schema({
    user : { type: schema.Types.ObjectId, ref: 'users' },
    friend : { type: schema.Types.ObjectId, ref: 'users' },
    created_at : Date,
    updated_at : Date
}, {collection : 'user_friend'});

module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            user_friend.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    if (typeof Class['methods'] === 'function') {
        let methods = Class.methods();
        for (let name in methods) {
            user_friend.methods[name] = methods[name];
        }
    }
    if (typeof Class['postMiddleware'] === 'function') {
        let postMiddlewares = Class.postMiddleware();
        for (let type in postMiddlewares) {
            user_friend.post(type, postMiddlewares[type]);
        }
    }
    return mongoose.model('user_friend', user_friend);
}