var mongoose = require('mongoose');
var schema = mongoose.Schema;
var users = schema({
    email : String,
    name : String,
    gender : Boolean, // 0: girl, 1: men
    birthday : Date,
    job : Number,
    introduce : String,
    facebook_token : String,
    encrypt_password : String,
    online_status : Boolean, // 0: offline, 1: online
    active : Boolean,
    created_at : Date
}, {collection : 'users'});
module.exports = mongoose.model('users', users);