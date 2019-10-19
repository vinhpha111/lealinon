var mongoose = require('mongoose');
var schema = mongoose.Schema;
var groups = schema({
    user_created : [{ type: schema.Types.ObjectId, ref: 'users' }],
    name : String,
    slug : String,
    description : String,
    created_at : Date,
    status : Date,
}, {collection : 'groups', toJSON: { virtuals: true }});
module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            groups.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    if (typeof Class['methods'] === 'function') {
        let methods = Class.methods();
        for (let name in methods) {
            groups.methods[name] = methods[name];
        }
    }
    if (typeof Class['postMiddleware'] === 'function') {
        let postMiddlewares = Class.postMiddleware();
        for (let type in postMiddlewares) {
            groups.post(type, postMiddlewares[type]);
        }
    }
    return mongoose.model('groups', groups);
}