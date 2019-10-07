var mongoose = require('mongoose');
var schema = mongoose.Schema;
var groups = schema({
    user_created : [{ type: schema.Types.ObjectId, ref: 'users' }],
    name : String,
    slug : String,
    description : String,
    created_at : Date,
    status : Number
}, {collection : 'groups'});
module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            groups.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    return mongoose.model('groups', groups);
}