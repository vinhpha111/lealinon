var mongoose = require('mongoose');
var schema = mongoose.Schema;
var room_users = schema({
    room : [{ type: Schema.Types.ObjectId, ref: 'rooms' }],
    user : [{ type: Schema.Types.ObjectId, ref: 'users' }]
}, {collection : 'room_users'});
module.exports = mongoose.model('room_users', room_users);