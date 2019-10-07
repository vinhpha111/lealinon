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

app.controller('newPost', function($routeParams, $scope, current_user, $location, $window, $http) {
    if (!current_user) {
        $window.location.href = 'login?redirect='+$location.$$absUrl
    }
    var id = $routeParams.id;
    $scope.id = id;
    $scope.type = 'exam';
    $scope.exam_type = 'essay';

    $scope.essay = {};
    $scope.addEssay = () => {
        $http.post('/api/group/'+id+'/new_essay', $scope.essay)
        .then(function(res){
            $scope.errors = null;
            console.log(res);
        }, function(res){
            console.log(res);
            $scope.errors = res.data.errors
        });
    }

    $scope.$on('$routeChangeStart', function($event, next, current) { 
        console.log('route change');
      });
});