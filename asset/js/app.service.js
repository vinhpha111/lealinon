app.service('$auth', function($rootScope, $http, $location, $window) {
    this.getUser = function(){
        return new Promise(function(resolve, reject){
            if ($rootScope.current_user) {
                resolve($rootScope.current_user);
            }
            $http.get("api/current_user")
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

    this.checkPermission = {
        group : function(listRole, groupId, redirect = null){
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