var mongoose = require('mongoose');
var schema = mongoose.Schema;
var post_groups = schema({
    user_created : [{ type: Schema.Types.ObjectId, ref: 'users' }],
    title : String,
    content : String,
    type : Number,
    group : [{ type: Schema.Types.ObjectId, ref: 'groups' }],
    start_at : Date,
    end_at : Date,
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
    return mongoose.model('post_groups', post_groups);
}