var mongoose = require('mongoose');
var schema = mongoose.Schema;
var comments = schema({
    post : { type: schema.Types.ObjectId, ref: 'post_groups' },
    user : { type: schema.Types.ObjectId, ref: 'users' },
    content : String,
    created_at : Date,
    updated_at : Date
}, {collection : 'comments'});

module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            comments.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    if (typeof Class['methods'] === 'function') {
        let methods = Class.methods();
        for (let name in methods) {
            comments.methods[name] = methods[name];
        }
    }
    if (typeof Class['postMiddleware'] === 'function') {
        let postMiddlewares = Class.postMiddleware();
        for (let type in postMiddlewares) {
            comments.post(type, postMiddlewares[type]);
        }
    }
    return mongoose.model('comments', comments);
}