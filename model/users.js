var User = require('./schema/users');
var bcrypt = require('bcrypt');
var salt = 10;
module.exports = {
    schema : User,
    findOne : (query, field_select) => {
        return new Promise((resolve, reject) => {
            User.findOne(query, field_select, (err, user) => {
                if (err) return handleError(err);
                resolve(user);
            })
        });
    },
    insert : (data) => {
        return new Promise((resolve,reject)=>{
            var user = new User(data);
            user.save((err) => {
                if (err) return handleError(err);
                resolve(user);
            });
        })
    },
    update : (filter, data, callback = null) => {
        return User.update(filter, data, callback);
    },
    generaEncrypt : (pass) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(pass, salt, async function(err, hash) {
                resolve(hash);
            });
        })
    },
    checkEncrypt : (pass, hash) => {
        return new Promise((resolve, reject)=>{
            bcrypt.compare(pass, hash, function(err, res) {
                resolve(res);
            });
        })
    }

}