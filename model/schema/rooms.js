var mongoose = require('mongoose');
var schema = mongoose.Schema;
var rooms = schema({
    type : Number,
}, {collection : 'rooms'});

module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            rooms.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    return mongoose.model('rooms', rooms);
}