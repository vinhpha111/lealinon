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
module.exports = mongoose.model('comments', comments);