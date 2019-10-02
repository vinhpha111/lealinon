app.controller('newGroup', function($scope, $location, $window, $http, current_user) {
    if (!current_user) {
        $window.location.href = '/login';
    }

    $scope.new = function(){
        let formData = new FormData();
        formData.append('name', $scope.name);
        formData.append('description', $scope.description);
        $http.post('/api/group/new', {
            name : $scope.name,
            description : $scope.description,
        })
        .then(function(res){
            $scope.errors = null;
            $location.path("/detail");

        }, function(res){
            $scope.errors = res.data.errors
        });
    }
})