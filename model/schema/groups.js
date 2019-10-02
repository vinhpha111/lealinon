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
module.exports = mongoose.model('groups', groups);