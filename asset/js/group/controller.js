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
});

app.controller('detailGroup', function($routeParams, $scope) {
    $scope.id = $routeParams.id;
});

app.controller('newPost', function($routeParams, $scope, current_user, $location, $window) {
    if (!current_user) {
        $window.location.href = 'login?redirect='+$location.$$absUrl
    }
    $scope.id = $routeParams.id;

    $scope.type = 'exam';
    $scope.exam_type = 'essay';
});