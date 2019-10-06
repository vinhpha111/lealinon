app.controller('newGroup', function($scope, $location, $window, $http, current_user, Scopes) {
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
            Scopes.get('scopeSidebar').getList();
            $location.path("/detail");

        }, function(res){
            $scope.errors = res.data.errors
        });
    }
});

app.controller('detailGroup', function($routeParams, $scope, $http) {
    $scope.id = $routeParams.id;
    $scope.notFound = false;
    $http.get('/api/group/get_by_id/'+$routeParams.id)
    .then(function(res){
        $scope.detail = res.data;
        console.log(res);
    }, function(res){
        $scope.detail = null;
        $scope.notFound = true;
        console.log(res);
    });
});

app.controller('newPost', function($routeParams, $scope, current_user, $location, $window) {
    if (!current_user) {
        $window.location.href = 'login?redirect='+$location.$$absUrl
    }
    $scope.id = $routeParams.id;

    $scope.type = 'exam';
    $scope.exam_type = 'essay';

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    $scope.schedule_date_start = today;
    $scope.schedule_time_start = '00:00';
    $scope.time_between = $scope.schedule_date_start + $scope.schedule_time_start;

    var scheduleDateStartArray = $scope.schedule_date_start.split('/');
    $scope.get_time_between = function(){
        $scope.time_between = $scope.schedule_date_start + $scope.schedule_time_start;
    }

    $scope.$on('$routeChangeStart', function($event, next, current) { 
        console.log('route change');
      });
});