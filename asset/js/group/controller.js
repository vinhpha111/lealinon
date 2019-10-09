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
    $scope.exceptIds = [];
    $scope.listPost = [];
    $scope.loadingPost = false;
    $http.get('/api/group/get_by_id/'+$routeParams.id)
    .then(function(res){
        $scope.detail = res.data;
    }, function(res){
        $scope.detail = null;
        $scope.notFound = true;
        console.log(res);
    });

    $scope.getPost = function(){
        if ($scope.loadingPost) {
            return;
        }
        $scope.loadingPost = true;
        $http.get('/api/group/'+$routeParams.id+'/list_post', {
            params: { exceptIds : $scope.exceptIds }
        })
        .then(function(res){
            for(let i in res.data){
                $scope.listPost.push(res.data[i]);
                $scope.exceptIds.push(res.data[i]._id);
            }
            $scope.loadingPost = false;
            console.log(res);
        }, function(res){
            console.log(res);
        })
    }

    $scope.getPost();
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
            $location.path('/group/'+id);
            console.log(res);
        }, function(res){
            console.log(res);
            $scope.errors = res.data.errors;
        });
    }

    $scope.$on('$routeChangeStart', function($event, next, current) { 
        console.log('route change');
      });
});