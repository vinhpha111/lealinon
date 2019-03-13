var mongoose = require('mongoose');
var schema = mongoose.Schema;
var groups = schema({
    user_created : [{ type: Schema.Types.ObjectId, ref: 'users' }],
    name : String,
    description : string,
    created_at : Date,
    status : Number
}, {collection : 'groups'});
module.exports = mongoose.model('groups', groups);