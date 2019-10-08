var bcrypt = require('bcrypt');
var salt = 10;
var baseModel = require('./base');

class User extends baseModel {
    constructor(){
        super('users');
    }

    generaEncrypt(pass) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(pass, salt, async function(err, hash) {
                resolve(hash);
            });
        })
    }

    checkEncrypt(pass, hash) {
        return new Promise((resolve, reject)=>{
            bcrypt.compare(pass, hash, function(err, res) {
                resolve(res);
            });
        })
    }
}

module.exports = User;