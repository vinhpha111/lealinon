var mongoose = require('mongoose');
var schema = mongoose.Schema;
var groups = schema({
    group_id : [{ type: schema.Types.ObjectId, ref: 'groups' }],
    user_id : [{ type: schema.Types.ObjectId, ref: 'users' }],
    type : Number, // 1: admin, 2: editor, 3: normal
    user_created : [{ type: schema.Types.ObjectId, ref: 'users' }],
    created_at : Date,
    updated_at : Number
}, {collection : 'group_member'});
module.exports = mongoose.model('group_member', groups);