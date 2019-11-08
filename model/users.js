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
                let listRole = self.listRole(typeRole, this, user_id);
                return listRole;
            },
            checkRole : async function(user_id, role){
                let listRole = await this.getRole(user_id);
                return self.roleCan(role, listRole);
            }
        }
    }

    async listRole(typeRole, user, userIdCheck){
        let inviteMakeFriendModel = require('./index').getInstance('user_invite_make_friend');

        let listInviteMakeFriend = await inviteMakeFriendModel.getModel().findOne({user: userIdCheck, user_invited: user._id});
        let hasInviteMakeFriend = false;
        let inviteMakeFriend = true;
        if (listInviteMakeFriend) {
            hasInviteMakeFriend = true;
            inviteMakeFriend = false;
        }

        let listsenderMakeFriend = await inviteMakeFriendModel.getModel().findOne({user: user._id, user_invited: userIdCheck});
        let isSenderMakeFriend = false;
        if (listsenderMakeFriend) {
            isSenderMakeFriend = true;
            inviteMakeFriend = false;
        }

        let isFriend = false;
        let userFriend = require('./index').getInstance('user_friend');
        let friend = await userFriend.getModel().findOne({user: userIdCheck, friend: user._id});
        if (friend) {
            isFriend = true;
            isSenderMakeFriend = false;
            inviteMakeFriend = false;
            hasInviteMakeFriend = false;
        }

        switch (typeRole) {
            case this.ROLE('SELF'):
                return {
                    viewProfile: true,
                    editProfile: true,
                    delete: true,
                    inviteMakeFriend: false,//
                    hasInviteMakeFriend: false,//
                    isSenderMakeFriend : false,
                    isFriend : false,
                    hasLogin: true,
                }
                break;
            case this.ROLE('HAS_LOGIN'):
                return {
                    viewProfile: true,
                    editProfile: false,
                    delete: false,
                    inviteMakeFriend: inviteMakeFriend,
                    hasInviteMakeFriend: hasInviteMakeFriend,
                    isSenderMakeFriend : isSenderMakeFriend,
                    isFriend : isFriend,
                    hasLogin: true,
                }
                break;
            case this.ROLE('NOT_LOGIN'):
                return {
                    viewProfile: true,
                    editProfile: false,
                    delete: false,
                    inviteMakeFriend: false,
                    hasInviteMakeFriend: false,
                    isSenderMakeFriend : false,
                    isFriend : false,
                    hasLogin: false,
                }
                break;
            default:
                return {
                    viewProfile: true,
                    editProfile: false,
                    delete: false,
                    inviteMakeFriend: false,
                    hasInviteMakeFriend: false,
                    isSenderMakeFriend : false,
                    isFriend : false,
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

    async findOrCreateFacebook(profile) {
        let user = await this.getModel().findOne({ facebook_id: profile.id });
        if (user) {
            return user;
        }
        let dataNew = {
            email : profile.emails[0] ? profile.emails[0].value : null,
            name : profile.displayName,
            facebook_id : profile.id,
            active : true,
            created_at : (new Date()).getTime(),
        }
        if (profile.photos[0]) {
            dataNew.avatar_path = profile.photos[0].value;
        }
        user = await this.getModel().create(dataNew);
        return user;
    }
}

module.exports = User;