var mongoose = require('mongoose');
var schema = mongoose.Schema;
var post_groups = schema({
    user_created : [{ type: Schema.Types.ObjectId, ref: 'users' }],
    title : String,
    content : string,
    type : Number,
    group : [{ type: Schema.Types.ObjectId, ref: 'groups' }],
    created_at : Date,
    updated_at : Date
}, {collection : 'post_groups'});
module.exports = mongoose.model('post_groups', post_groups);