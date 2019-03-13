var mongoose = require('mongoose');
var schema = mongoose.Schema;
var feels = schema({
    item_id : Number,
    item_type : Number,
    feel_type : Number,
    user : [{ type: Schema.Types.ObjectId, ref: 'users' }],
    created_at : Date,
    updated_at : Date
}, {collection : 'feels'});
module.exports = mongoose.model('feels', feels);