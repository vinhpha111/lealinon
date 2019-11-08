app.controller('doEssay', function($scope, $routeParams, $route, $http, seoInfo){
    $scope.answer = {};
    $scope.errors = null;
    $scope.loading = true;

    $http.get('/api/post/'+$routeParams.id+'/get_essay')
    .then(function(res){
        $scope.detail = res.data;
        if (res.data.answer) {
            $scope.answer = res.data.answer;   
        }
        seoInfo.setTitle($scope.detail.title+' - bài làm');
        $scope.loading = false;
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
        $scope.loading = false;
    });

    $scope.sendAnswer = function(isDraft = false){
        console.log($scope.answer);
        $scope.errors = null;
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