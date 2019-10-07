var mongoose = require('mongoose');
var schema = mongoose.Schema;
var chat_messages = schema({
    room : [{ type: Schema.Types.ObjectId, ref: 'rooms' }],
    user : [{ type: Schema.Types.ObjectId, ref: 'users' }],
    message : String,
    created_at : Date,
    updated_at : Date
}, {collection : 'chat_messages'});

module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            chat_messages.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    return mongoose.model('chat_messages', chat_messages);
}