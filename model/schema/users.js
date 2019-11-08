var mongoose = require('mongoose');
var schema = mongoose.Schema;
var users = schema({
    email : String,
    name : String,
    avatar_path : {
        type: String,
        default: '/image/none-user.png'
    },
    gender : Boolean, // 0: girl, 1: men
    birthday : Date,
    job : Number,
    introduce : String,
    facebook_id : {
        type: String,
        select: false
    },
    encrypt_password : {
        type: String,
        select: false
    },
    online_status : Boolean, // 0: offline, 1: online
    token_login : [String],
    active : Boolean,
    created_at : Date
}, {collection : 'users'});

module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            users.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    if (typeof Class['methods'] === 'function') {
        let methods = Class.methods();
        for (let name in methods) {
            users.methods[name] = methods[name];
        }
    }
    if (typeof Class['postMiddleware'] === 'function') {
        let postMiddlewares = Class.postMiddleware();
        for (let type in postMiddlewares) {
            users.post(type, postMiddlewares[type]);
        }
    }
    return mongoose.model('users', users);
}