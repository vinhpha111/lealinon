app.controller('doEssay', function($scope, $routeParams, $route, $location, $window, $http, current_user, Scopes){
    $scope.answer = {};
    $scope.errors = null;

    $http.get('/api/post/'+$routeParams.id+'/get_essay')
    .then(function(res){
        $scope.detail = res.data;
        setTimeout(function(){
            let height = $('.content-essay')[0].scrollHeight;
            if (height > 200) {
                $scope.$apply(function(){
                    $scope.detail.reduce = true;
                    console.log($scope.detail.reduce);
                });
            }
        }, 200);
    }, function(err){
        $scope.status = err.status;
    });

    $scope.sendAnswer = function(isDraft = false){
        $scope.detail.sending = true;
        $scope.answer.isDraft = isDraft;
        $http.post('/api/post/'+$routeParams.id+'/add_essay_answer', $scope.answer)
        .then(function(res){
            $scope.detail.sending = false;
            if(!isDraft) $route.reload();
            else {
                $scope.answer = res.data;
            }
        }, function(err){
            $scope.detail.sending = false;
            $scope.errors = err.data.errors;
        });
    }
})