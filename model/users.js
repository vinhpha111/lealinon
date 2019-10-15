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

    findByString(query){
        let list = this.getModel().aggregate()
        .match({
            $or: [
                { email: new RegExp(query.string) },
            ],
            _id: {
                $nin: query.exceptIds
            }
        })
        .sort({'created_at': 'desc'})
        .project({
            _id: 1,
            email: 1,
            name: 1,
            gender: 1,
            birthday: 1,
            job: 1,
            online_status: 1,
            active: 1,
            created_at: 1,
            table: "user"
        })
        .limit(10)
        .exec();
        return list;
    }
}

module.exports = User;