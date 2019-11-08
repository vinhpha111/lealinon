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

app.controller('detailGroup', function($scope, $routeParams, $route, $http, Scopes, $auth, socket, $timeout, seoInfo) {
    $scope.id = $routeParams.id;
    $scope.notFound = false;
    $scope.exceptIds = [];
    $scope.listPost = [];
    $scope.loadingPost = false;
    $scope.typePost = $auth.typePost;
    $http.get('/api/group/get_by_id/'+$routeParams.id)
    .then(function(res){
        $scope.detail = res.data;
        seoInfo.setTitle($scope.detail.name);
        socket.join('group_'+$scope.id);
    }, function(res){
        $scope.detail = null;
        $scope.notFound = true;
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
            let countData = parseInt($scope.listPost.length);
            for(let i in res.data){
                let index = countData + parseInt(i);
                res.data[i].typingCommnet = false;
                $scope.listPost.push(res.data[i]);
                $scope.exceptIds.push(res.data[i]._id);
                $scope.showComment(index);
                onTypingCommentPost(res.data[i]._id, index);
                onCommentPost(res.data[i]._id, index);
                getFeelPost(res.data[i]._id, index);
                listenFeelPost(res.data[i]._id, index)
            }
            $scope.loadingPost = false;;
        }, function(err){
            $scope.loadingPost = false;
        })
    }
    $scope.getPost();

    $scope.showComment = function(postIndex) {
        let post = $scope.listPost[postIndex];
        if (post) {
            let oldHeight = 0;
            let exceptIds = [];
            for(let i in post.comments) {
                exceptIds.push((post.comments)[i]._id)
            }
            let moreFlag = exceptIds.length > 0;
            if (moreFlag) {
                oldHeight = $('.comment_content_post_'+post._id)[0].scrollHeight;
            }
            $scope.listPost[postIndex].loadingComment = true;
            $http.get('/api/post/'+post._id+'/get_comment', {
                params : {
                    "exceptIds[]" : exceptIds
                }
            })
            .then(function(res){
                $scope.listPost[postIndex].comments = 
                    $scope.listPost[postIndex].comments ? $scope.listPost[postIndex].comments.concat(res.data)
                    : res.data;
                $scope.listPost[postIndex].loadingComment = false;
                if (!moreFlag) {
                    scrollToBottom('.comment_content_post_'+post._id);   
                } else {
                    setTimeout(function(){
                        $('.comment_content_post_'+post._id).scrollTop($('.comment_content_post_'+post._id)[0].scrollHeight - oldHeight);
                    }, 100);
                }
            })
        }
    }

    function scrollToBottom(selector){
        setTimeout(function(){
            $(selector).scrollTop($(selector)[0].scrollHeight);
        }, 100);
    }
    
    $scope.invite = {};
    $scope.invite.searchingUser = false;
    $scope.invite.listFindUserInvite = null;
    $scope.invite.stringFindUserInvite = '';
    $scope.searchUser = function(){
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
        }, function(err){
            $scope.invite.searchingUser = false;
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

    $scope.sendComment = function(postIndex) {
        let post = $scope.listPost[postIndex];
        if (post && post.commentContent) {
            $scope.listPost[postIndex].sendingComment = true;
            $http.post('/api/post/'+post._id+'/add_comment', {
                content: post.commentContent.replace(/\n/g, "<br />")
            })
            .then(function(res) {
                $scope.listPost[postIndex].commentContent = "";
                // $scope.listPost[postIndex].comments.push(res.data);
                $scope.listPost[postIndex].sendingComment = false;
                scrollToBottom('.comment_content_post_'+post._id);
            }, function(err) {
                $scope.listPost[postIndex].sendingComment = false;
            });
        }
    }

    $scope.typingCommentPost = function(postId) {
        socket.emit('typingCommentPost', {
            groupId : $scope.id,
            postId : postId
        });
    }

    var typingCommentPost = {};
    function onTypingCommentPost(postId, postIndex) {
        socket.on('post_'+postId, function(data){
            $scope.$apply(function() {
                let post = $scope.listPost[postIndex];
                if (post) {
                    $scope.listPost[postIndex]['typingCommnet'] = true;
                    if (typingCommentPost['post_'+postId]) {
                        $timeout.cancel(typingCommentPost['post_'+postId]);
                    }
                    typingCommentPost['post_'+postId] = $timeout(function(){
                        $scope.listPost[postIndex].typingCommnet = false;
                    }, 1000);   
                }
            })
        });
    }

    function onCommentPost(postId, postIndex) {
        socket.on('comment_post_'+postId, function(data){
            $scope.$apply(function() {
                let post = $scope.listPost[postIndex];
                $scope.listPost[postIndex].comments.push(data);
            })
        });
    }

    $scope.setFeelPost = function(postId, type) {
        let index = null;
        switch ([1,2].indexOf(type) !== -1) {
            case true:
                for (let i in $scope.listPost) {
                    if ($scope.listPost[i]._id === postId) {
                        index = i;
                        $scope.listPost[index].settingFeel = true;
                    }
                }
                $http.post('/api/post/'+postId+'/set_feel', {
                    type: type
                }).then(function(res){
                    $scope.listPost[index].settingFeel = false;
                });
                break;
        
            default:
                break;
        }
    }

    function getFeelPost(postId, postIndex) {
        $http.get('/api/post/'+postId+'/get_feel')
        .then(function(res){
            $scope.listPost[postIndex].countLike = res.data.countLike;
            $scope.listPost[postIndex].countUnlike = res.data.countUnlike;
            $scope.listPost[postIndex].liked = res.data.hasLike;
            $scope.listPost[postIndex].unliked = res.data.hasUnlike;
        }, function(err){
            $scope.listPost[postIndex].countLike = 0;
            $scope.listPost[postIndex].countUnlike = 0;
            $scope.listPost[postIndex].liked = 0;
            $scope.listPost[postIndex].unliked = 0;
        });
    }

    function listenFeelPost(postId, postIndex) {
        socket.on('add_feel_post_'+postId, function(data){
            $scope.$apply(function() {
                switch (data.feel_type) {
                    case 1:
                        $scope.listPost[postIndex].countLike++;
                        break;
                    case 2:
                        $scope.listPost[postIndex].countUnlike++;
                        break;
                
                    default:
                        break;
                }
            })
        });

        socket.on('remove_feel_post_'+postId, function(data){
            $scope.$apply(function() {
                switch (data.feel_type) {
                    case 1:
                        $scope.listPost[postIndex].countLike--;
                        $scope.listPost[postIndex].countLike = 
                            ($scope.listPost[postIndex].countLike < 0 
                                ? 0 
                                : $scope.listPost[postIndex].countLike);
                        break;
                    case 2:
                        $scope.listPost[postIndex].countUnlike--;
                        $scope.listPost[postIndex].countUnlike = 
                            ($scope.listPost[postIndex].countUnlike < 0 
                                ? 0 
                                : $scope.listPost[postIndex].countUnlike);
                        break;
                
                    default:
                        break;
                }
            })
        });
    }

    $scope.$on('$routeChangeStart', function (event, current, previous) {
        socket.leave('group_'+$scope.id);
    });

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
        let data = $scope.essay;
        data.startDate = (new Date(data.startDate)).getTime();
        data.endDate = (new Date(data.endDate)).getTime();
        $http.post('/api/group/'+id+'/new_essay', data)
        .then(function(res){
            $scope.errors = null;
            $location.path('/group/'+id);
        }, function(res){
            $scope.errors = res.data.errors;
        });
    }

    $scope.quiz = {};
    $scope.quiz.questions = [{}];
    $scope.addQuiz = function(){
        let data = $scope.quiz;
        data.startDate = (new Date(data.startDate)).getTime();
        data.endDate = (new Date(data.endDate)).getTime();
        $http.post('/api/group/'+id+'/new_quiz', data)
        .then(function(res){
            $scope.errors = null;
            $location.path('/group/'+id);
        }, function(res){
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
    }, function(res){
        $scope.detail = null;
        $scope.notFound = true;
    });

    $http.get('/api/group/'+$routeParams.id+'/get_member')
    .then(function(res){
        $scope.members = res.data;
    }, function(res){
        $scope.members = null;
    });

    $http.get('/api/group/'+$routeParams.id+'/get_member_ask_join')
    .then(function(res){
        $scope.memberAskJoin = res.data;
    }, function(res){
        $scope.memberAskJoin = null;
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