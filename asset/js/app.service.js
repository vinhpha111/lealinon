app.service('$auth', function($rootScope, $http, $location, $window) {
    this.getUser = function(){
        return new Promise(function(resolve, reject){
            if ($rootScope.current_user) {
                resolve($rootScope.current_user);
            }
            $http.get("api/user/current_user")
            .then(function(response) {
                resolve(response.data);
            }, function(response){
                resolve(null);
            });
        });
    }
    
    this.role = {
        group : {
            ADMIN : 1,
            EDITOR : 2,
            NORMAL : 3
        }
    }
    
    this.typePost = function(name) {
        switch (name) {
            case 'ESSAY':
            return 1;
            break;
            case 'QUIZ':
            return 2;
            break;
            case 'ANNOUNCE':
            return 3;
            break;
            default:
            return 3;
            break;
        }
    }
    
    this.checkPermission = {
        group : function(listRole, groupId, redirect) {
            return new Promise(function(resolve, reject){
                $http.get("api/group/permission/"+groupId)
                .then(function(res){
                    for(let i in listRole){
                        for(let j in res.data.roles){
                            if (listRole[i] === res.data.roles[j]) {
                                resolve(true);
                                return;
                            }
                        }
                    }
                    if (redirect) {
                        $window.location.href = redirect;
                    }
                    resolve(false);
                }, function(res){
                    reject(res)
                    resolve(false);
                });
            });
        }
    }
});

app.factory('Scopes', function(){
    var item = {};
    return {
        store: function(key, value){
            item[key] = value;
        },
        get: function(key){
            return item[key];
        }
    }
});

app.factory('socket', function(){
    var socket = null;
    return {
        init: function(){
            socket = io();
        },
        join: function(roomName){
            socket.emit('joinRoom', roomName);
        },
        leave: function(roomName) {
            socket.emit('leaveRoom', roomName);
        },
        on: function(eventName, callback){
            socket.on(eventName, callback);
        },
        emit: function(eventName, data){
            socket.emit(eventName, data);
        },
        removeListener: function(event, action){
            socket.removeListener(event, action);
        }
    }
});

app.factory('Sound', function(){
    return {
        notification: function(){
            return new Promise(function(resolve, reject){
                var audio = new Audio('audio/notification.mp3');
                audio.play().then(function () {
                    resolve(audio);                
                })
            })
        }
    }
});

app.factory('seoInfo', function() {
    var mainTile = 'Lealinon';
    var subTitle = null;
    return {
        title: function() {
            return (subTitle ? subTitle + ' | ' : '') + mainTile; 
        },
        setTitle: function(newTitle) { subTitle = newTitle }
    };
});