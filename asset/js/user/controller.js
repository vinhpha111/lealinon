app.controller('profileUser', function($scope, $routeParams, $http){
    let id = $routeParams.id;
    $scope.id = id;
    $scope.detail = null;
    $http.get('/api/user/get_by_id/'+id)
    .then(function(res){
        $scope.detail = res.data;
        console.log(res);
    }, function(err){
        $scope.detail = null;
    });

    $scope.userEdit = {};
    $scope.editProfile = function(){
        for(let key in $scope.detail) {
            $scope.userEdit[key] = $scope.detail[key];
        }
        $scope.detail.activeEditProfile = true;
    }
});