var mongoose = require('mongoose');
var schema = mongoose.Schema;
var post_groups = schema({
    user_created : { type: schema.Types.ObjectId, ref: 'users' },
    title : String,
    content : String,
    type : Number, // 1: essay, 2: quiz, 3: announce
    group : { type: schema.Types.ObjectId, ref: 'groups' },
    start_at : Date,
    end_at : Date,
    has_stop : { type: Boolean, default: false },
    created_at : Date,
    updated_at : Date
}, {collection : 'post_groups'});

module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            post_groups.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    if (typeof Class['methods'] === 'function') {
        let methods = Class.methods();
        for (let name in methods) {
            post_groups.methods[name] = methods[name];
        }
    }
    if (typeof Class['postMiddleware'] === 'function') {
        let postMiddlewares = Class.postMiddleware();
        for (let type in postMiddlewares) {
            post_groups.post(type, postMiddlewares[type]);
        }
    }
    return mongoose.model('post_groups', post_groups);
}