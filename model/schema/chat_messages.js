var mongoose = require('mongoose');
var schema = mongoose.Schema;
var chat_messages = schema({
    room : [{ type: Schema.Types.ObjectId, ref: 'rooms' }],
    user : [{ type: Schema.Types.ObjectId, ref: 'users' }],
    message : String,
    created_at : Date,
    updated_at : Date
}, {collection : 'chat_messages'});
module.exports = mongoose.model('chat_messages', chat_messages);