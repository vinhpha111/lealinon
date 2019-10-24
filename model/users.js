var bcrypt = require('bcrypt');
var salt = 10;
var baseModel = require('./base');

class User extends baseModel {
    constructor(){
        super('users');
    }

    ROLE(name = null){
        let roleList = {
            SELF : 1,
            HAS_LOGIN : 2,
            NOT_LOGIN : 3,
        }
        if (roleList[name]) {
            return roleList[name]
        }
        return null;
    }

    methods() {
        let self = this;
        return {
            getRole : async function(user_id){
                let typeRole = user_id == this._id ? self.ROLE('SELF') : null;
                if (!user_id) {
                    typeRole = self.ROLE('NOT_LOGIN');
                }
                if (!typeRole && user_id) {
                    typeRole = self.ROLE('HAS_LOGIN');
                }
                let listRole = self.listRole(typeRole);
                return listRole;
            },
            checkRole : async function(user_id, role){
                let listRole = await this.getRole(user_id);
                return self.roleCan(role, listRole);
            }
        }
    }

    listRole(typeRole){
        switch (typeRole) {
            case this.ROLE('SELF'):
                return {
                    viewProfile: true,
                    editProfile: true,
                    delete: true,
                    inviteMakeFriend: false,
                    hasLogin: true,
                }
                break;
            case this.ROLE('HAS_LOGIN'):
                return {
                    viewProfile: true,
                    editProfile: false,
                    delete: false,
                    inviteMakeFriend: true,
                    hasLogin: true,
                }
                break;
            case this.ROLE('NOT_LOGIN'):
                return {
                    viewProfile: true,
                    editProfile: false,
                    delete: true,
                    inviteMakeFriend: false,
                    hasLogin: false,
                }
                break;
            default:
                return {
                    viewProfile: true,
                    editProfile: false,
                    delete: false,
                    inviteMakeFriend: false,
                    hasLogin: false,
                }
                break;
        }
    }

    roleCan(type, listRole){
        return listRole[type] ? true : false; 
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