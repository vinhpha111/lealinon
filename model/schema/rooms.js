var mongoose = require('mongoose');
var schema = mongoose.Schema;
var rooms = schema({
    type : Number,
}, {collection : 'rooms'});
module.exports = mongoose.model('rooms', rooms);