var mongoose = require('mongoose');
var schema = mongoose.Schema;
var chat_messages = schema({
    to : { type: schema.Types.ObjectId, ref: 'users' },
    from : { type: schema.Types.ObjectId, ref: 'users' },
    message : String,
    has_see: Boolean,
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