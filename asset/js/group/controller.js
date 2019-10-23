app.controller('newGroup', function($scope, $location, $window, $http, current_user, Scopes) {
    if (!current_user) {
        $window.location.href = '/login';
    }

    console.log(current_user);

    $scope.data = {};
    $scope.new = function(){
        $http.post('/api/group/new', $scope.data)
        .then(function(res){
            $scope.errors = null;
            Scopes.get('scopeSidebar').getList();
            $location.path("/detail");

        }, function(res){
            $scope.errors = res.data.errors
        });
    }
});

app.controller('detailGroup', function($scope, $routeParams, $route, $http, Scopes) {
    $scope.id = $routeParams.id;
    $scope.notFound = false;
    $scope.exceptIds = [];
    $scope.listPost = [];
    $scope.loadingPost = false;
    $http.get('/api/group/get_by_id/'+$routeParams.id)
    .then(function(res){
        $scope.detail = res.data;
        console.log(res.data);
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
            $scope.loadingPost = false;
            console.log(res);
        })
    }
    $scope.getPost();
    
    $scope.invite = {};
    $scope.invite.searchingUser = false;
    $scope.invite.listFindUserInvite = null;
    $scope.invite.stringFindUserInvite = '';
    $scope.searchUser = function(){
        console.log($scope.invite.stringFindUserInvite);
        if ($scope.invite.searchingUser) {
            return;
        }
        $scope.invite.searchingUser = true;
        $http.get('/api/user/find', {
            params: { string : $scope.invite.stringFindUserInvite }
        })
        .then(function(res){
            $scope.invite.listFindUserInvite = res.data;
            $scope.invite.searchingUser = false;
            console.log(res);
        }, function(res){
            $scope.invite.searchingUser = false;
            console.log(res);
        })
    }

    $scope.inviteUserJoinGroup = function(){
        let ids = [];
        for(let i in $scope.invite.listFindUserInvite){
            if ($scope.invite.listFindUserInvite[i].checked) {
                ids.push($scope.invite.listFindUserInvite[i]._id);
            }
        }
        if (ids.length > 0) {
            $scope.invite.stringFindUserInvite = null;
            $scope.invite.listFindUserInvite = null;
            $scope.invite.introduce = null;
            $http.post('/api/group/'+$routeParams.id+"/invite_member",{
                ids : ids,
                introduce : $scope.invite.introduce
            })
            .then(function(res){
                Scopes.get('scopeMessage').alertMessages = [
                    {
                        type: 'success',
                        content: 'Đã gửi lời mời tham gia nhóm!'
                    }
                ];
            }, function(res){
                Scopes.get('scopeMessage').alertMessages = [
                    {
                        type: 'danger',
                        content: 'Có lỗi xãy ra, hãy thử lại!'
                    }
                ];
            })
        }
    }

    $scope.invite.canSendInvite = false;
    $scope.checkSendInvite = function(){
        for(let i in $scope.invite.listFindUserInvite){
            if ($scope.invite.listFindUserInvite[i].checked) {
                $scope.invite.canSendInvite = true;
                console.log($scope.invite.canSendInvite);
                return;
            }
        }
        $scope.invite.canSendInvite = false;
    }

    $scope.joinGroup = function(){
        $http.post('/api/group/'+$routeParams.id+'/join_group', {
            message: null
        })
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

app.controller('newPost', function($routeParams, $scope, current_user, $location, $window, $http) {
    if (!current_user) {
        $window.location.href = 'login?redirect='+$location.$$absUrl
    }
    $scope.location = $location;
    var id = $routeParams.id;
    $scope.id = id;

    let type = $location.search().type ? $location.search().type : 'exam';
    $scope.type = 'exam';
    if (['exam', 'post'].indexOf(type) !== -1) {
        $scope.type = type;
    }

    let exam_type = $location.search().exam_type ? $location.search().exam_type : 'essay';
    $scope.exam_type = 'essay';
    if (['essay', 'quiz'].indexOf(exam_type) !== -1) {
        $scope.exam_type = exam_type;
    }

    $scope.essay = {};
    $scope.addEssay = function() {
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

    $scope.quiz = {};
    $scope.quiz.questions = [{}];
    $scope.addQuiz = function(){
        console.log($scope.quiz);
        $http.post('/api/group/'+id+'/new_quiz', $scope.quiz)
        .then(function(res){
            $scope.errors = null;
            $location.path('/group/'+id);
            console.log(res);
        }, function(res){
            console.log(res);
            $scope.errors = res.data.errors;
        })
    }

    $scope.$on('$routeChangeStart', function($event, next, current) { 
        console.log('route change');
    });
});

app.controller('managementGroup', function($scope, $routeParams, $http, Scopes){
    $scope.id = $routeParams.id;
    $http.get('/api/group/get_by_id/'+$routeParams.id)
    .then(function(res){
        $scope.detail = res.data;
        console.log(res.data);
    }, function(res){
        $scope.detail = null;
        $scope.notFound = true;
        console.log(res);
    });

    $http.get('/api/group/'+$routeParams.id+'/get_member')
    .then(function(res){
        $scope.members = res.data;
        console.log(res.data);
    }, function(res){
        $scope.members = null;
        console.log(res);
    });

    $http.get('/api/group/'+$routeParams.id+'/get_member_ask_join')
    .then(function(res){
        $scope.memberAskJoin = res.data;
        console.log(res.data);
    }, function(res){
        $scope.memberAskJoin = null;
        console.log(res);
    });

    $scope.acceptJoin = function(index){
        $http.post('/api/group/'+$routeParams.id+'/accept_join', {
            user_id: $scope.memberAskJoin[index]._id
        })
        .then(function(res){
            $scope.members.unshift(res.data);
            $scope.memberAskJoin[index].activeAskJoinBtn = false;
            $scope.memberAskJoin.splice(index, 1);
        }, function(err){
            $scope.memberAskJoin[index].activeAskJoinBtn = false;
            Scopes.get('scopeMessage').alertMessages = [
                {
                    type: 'danger',
                    content: 'Có lỗi xãy ra, hãy thử lại!'
                }
            ];
        });
    }

    $scope.refuseJoin = function(index){
        $http.post('/api/group/'+$routeParams.id+'/refuse_join', {
            user_id: $scope.memberAskJoin[index]._id
        })
        .then(function(res){
            $scope.memberAskJoin[index].activeAskJoinBtn = false;
            $scope.memberAskJoin.splice(index, 1);
        }, function(err){
            $scope.memberAskJoin[index].activeAskJoinBtn = false;
            Scopes.get('scopeMessage').alertMessages = [
                {
                    type: 'danger',
                    content: 'Có lỗi xãy ra, hãy thử lại!'
                }
            ];
        });
    }

    $scope.removeMember = null;

    $scope.openPopupRemoveMember = function(member){
        $scope.removeMember = member;
    }

    $scope.removeMemberAccept = function(){
        console.log('sdfsfsdf');
        $http.delete('/api/group/'+$routeParams.id+'/remove_member', {
            params : {
                user_id: $scope.removeMember.user_id._id
            }
        })
        .then(function(res){
            for (const i in $scope.members) {
                if ($scope.members[i] === $scope.removeMember) {
                    $scope.members.splice(i, 1);
                }
            }
            $scope.removeMember = null;
        }, function(err){
            $scope.removeMember = null;
            Scopes.get('scopeMessage').alertMessages = [
                {
                    type: 'danger',
                    content: 'Có lỗi xãy ra, hãy thử lại!'
                }
            ];
        });
    }
})