var mongoose = require('mongoose');
var schema = mongoose.Schema;
var comments = schema({
    item_id : Number,
    item_type : Number,
    content : Number,
    user : [{ type: Schema.Types.ObjectId, ref: 'users' }],
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
    return mongoose.model('comments', comments);
}