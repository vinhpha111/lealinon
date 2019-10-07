var mongoose = require('mongoose');
var schema = mongoose.Schema;
var room_users = schema({
    room : [{ type: Schema.Types.ObjectId, ref: 'rooms' }],
    user : [{ type: Schema.Types.ObjectId, ref: 'users' }]
}, {collection : 'room_users'});

module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            room_users.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    return mongoose.model('room_users', room_users);
}