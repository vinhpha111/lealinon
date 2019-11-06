app.controller('profileUser', function($scope, $routeParams, $http, $route, $rootScope, $location, Scopes){
    let id = $routeParams.id;
    $scope.id = id;
    $scope.detail = null;
    $http.get('/api/user/get_by_id/'+id)
    .then(function(res){
        $scope.detail = res.data;
        console.log(res);
    }, function(err){
        $scope.detail = null;
        if (err.status === 404) {
            $location.path( "/404.html" );
        }
    });

    $scope.userEdit = {};
    $scope.editProfile = function(){
        for(let key in $scope.detail) {
            $scope.userEdit[key] = $scope.detail[key];
        }
        $scope.detail.activeEditProfile = true;
    }

    $scope.putEditProfile = function() {
        console.log($scope.userEdit);
        let formData = new FormData();
        for(let i in $scope.userEdit){
            formData.append(i, $scope.userEdit[i]);
        }
        $http.post('/api/user/'+id+'/edit', formData, {
            transformRequest: angular.identity,
            headers: { 
                'Content-Type': undefined
            }
        }).then(function(res){
            Scopes.get('scopeMessage').alertMessages = null;
            $route.reload();
            $rootScope.getCurrentUser();
        }, function(err){
            console.log(err);
            if (err.status === 422) {
                $scope.userEdit.errors = err.data.errors;
            } else {
                Scopes.get('scopeMessage').alertMessages = [
                    {
                        type: 'danger',
                        content: 'Có lỗi xãy ra, hãy thử lại!'
                    }
                ];
            }
        })
    }

    $scope.inviteMakeFriend = function() {
        $http.post('/api/user/'+id+'/invite_make_friend', {
            userId: id
        }).then(function(res){
            $route.reload();
        }, function(err){
            Scopes.get('scopeMessage').alertMessages = [
                {
                    type: 'danger',
                    content: 'Có lỗi xãy ra, hãy thử lại!'
                }
            ];
        });
    }

    $scope.acceptMakeFriend = function(){
        $http.post('/api/user/'+id+'/accept_make_friend')
        .then(function(res){
            $route.reload();
        }, function(err){
            Scopes.get('scopeMessage').alertMessages = [
                {
                    type: 'danger',
                    content: 'Có lỗi xãy ra, hãy thử lại!'
                }
            ];
        })
    }
});