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
});

app.controller('detailEssay', function($scope, $routeParams, $route, $http, seoInfo, Scopes){
    $scope.answer = {};
    $scope.errors = null;
    $scope.loading = true;

    $http.get('/api/post/'+$routeParams.id+'/get_essay')
    .then(function(res){
        $scope.detail = res.data;
        if (res.data.answer) {
            $scope.answer = res.data.answer;   
        }
        if (res.data.role.viewListAnswer) {
            $scope.detail.listAnswer = [];
            getEssayAnswer();
        }
        seoInfo.setTitle($scope.detail.title);
        $scope.loading = false;
        setTimeout(function(){
            let height = $('.content-essay')[0].scrollHeight;
            if (height > 200) {
                $scope.$apply(function(){
                    $scope.detail.reduce = true;
                    $scope.detail.reduceBack = true;
                });
            }
        }, 200);
    }, function(err){
        $scope.status = err.status;
        $scope.loading = false;
    });

    $scope.showComment = function() {
        $scope.detail.hasShowComment = !$scope.detail.hasShowComment;
        if (!$scope.hasLoadComment) {
            Scopes.get('scopeCommentPostBox').init($scope.detail._id, $scope.detail.group._id)
            $scope.hasLoadComment = true;
        }
    }

    function getEssayAnswer() {
        let exceptIds = [];
        $scope.detail.loadListAnswer = true;
        for(let i in $scope.detail.listAnswer) {
            exceptIds.push($scope.detail.listAnswer._id);
        }
        $http.get('/api/post/'+$routeParams.id+'/get_list_essay_answer', {
            params : {
                'exceptIds' : exceptIds
            }
        }).then(function(res){
            $scope.detail.loadListAnswer = false;
            $scope.detail.listAnswer = res.data.concat($scope.detail.listAnswer)
        }, function(err) {
            $scope.detail.loadListAnswer = false;
        })
    }
});

app.controller('detailEssayAnswer', function($scope, $routeParams, $route, $http, seoInfo, Scopes){
    $scope.detail = {};
    $scope.errors = null;
    $scope.loading = true;
    $scope.evaluate = {
        score: 0,
        numHover: 0,
    };

    $http.get('/api/post/get_detail_essay_answer/'+$routeParams.id)
    .then(function(res){
        $scope.loading = false;
        $scope.detail = res.data;
        seoInfo.setTitle('Đánh giá');
        $scope.loading = false;
        setTimeout(function(){
            let height = $('.content-essay')[0].scrollHeight;
            if (height > 200) {
                $scope.$apply(function(){
                    $scope.detail.post.reduce = true;
                    $scope.detail.post.reduceBack = true;
                });
            }
        }, 200);
    }, function(err){
        $scope.status = err.status;
        $scope.loading = false;
    });

    $scope.submitAvaluate = function(){
        $scope.evaluate.disableSubmit = true;
        $http.post('/api/post/add_evaluate_essay_answer/'+$routeParams.id, $scope.evaluate)
        .then(function(res) {
            $route.reload();
        }, function(err) {
            $scope.evaluate.errors = err.data.errors;
            $scope.evaluate.disableSubmit = false;
        })
    }
});