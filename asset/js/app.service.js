app.service('$auth', function($rootScope, $http) {
    this.getUser = function(){
        return new Promise(function(resolve, reject){
            if ($rootScope.current_user) {
                resolve($rootScope.current_user);
            }
            $http.get("api/current_user")
            .then(function(response) {
                console.log('get user');
                resolve(response.data);
            }, function(response){
                resolve(null);
            });
        });
    }
})