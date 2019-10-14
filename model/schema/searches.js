var mongoose = require('mongoose');
var schema = mongoose.Schema;
var searches = schema({
    group_id: { type: schema.Types.ObjectId, ref: 'groups' },
    user_id: { type: schema.Types.ObjectId, ref: 'users' },
    post_id: { type: schema.Types.ObjectId, ref: 'posts' },
}, {collection : 'searches'});

module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            searches.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }

    if (typeof Class['postMiddleware'] === 'function') {
        let postMiddlewares = Class.postMiddleware();
        for (let type in postMiddlewares) {
            searches.post(type, postMiddlewares[type]);
        }
    }

    return mongoose.model('searches', searches);
}