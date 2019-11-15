app.component('commentPostBox', {
    templateUrl: 'js/component/commentPostBox/template.html',
    controller: 'commentPostBoxController',
});

app.controller('commentPostBoxController', function($scope, $rootScope, $http, Scopes, $auth, socket, $timeout){
    $scope.post = {};
    $scope.show = false;
    $scope.init = function(postId, groupId) {
        $scope.show = true;
        $scope.post._id = postId;
        $scope.post.groupId = groupId;
        socket.join('group_'+groupId);
        $scope.showComment();
        onTypingCommentPost(postId);
        onCommentPost(postId);

    }

    $scope.sendComment = function() {
        if ($scope.post.commentContent) {
            $scope.post.sendingComment = true;
            $http.post('/api/post/'+$scope.post._id+'/add_comment', {
                content: $scope.post.commentContent.replace(/\n/g, "<br />")
            })
            .then(function(res) {
                $scope.post.commentContent = "";
                $scope.post.sendingComment = false;
                scrollToBottom('.comment_content_post_'+$scope.post._id);
            }, function(err) {
                $scope.post.sendingComment = false;
            });
        }
    }

    $scope.typingCommentPost = function() {
        socket.emit('typingCommentPost', {
            groupId : $scope.post.groupId,
            postId : $scope.post.id
        });
    }

    var typingCommentPost = {};
    function onTypingCommentPost(postId) {
        socket.on('post_'+postId, function(data){
            $scope.$apply(function() {
                if ($scope.post) {
                    $scope.post['typingCommnet'] = true;
                    if (typingCommentPost['post_'+postId]) {
                        $timeout.cancel(typingCommentPost['post_'+postId]);
                    }
                    typingCommentPost['post_'+postId] = $timeout(function(){
                        $scope.post.typingCommnet = false;
                    }, 1000);   
                }
            })
        });
    }

    function onCommentPost(postId) {
        socket.on('comment_post_'+postId, function(data){
            $scope.$apply(function() {
                $scope.post.comments.push(data);
            })
        });
    }

    $scope.showComment = function() {
        if ($scope.post) {
            let oldHeight = 0;
            let exceptIds = [];
            for(let i in $scope.post.comments) {
                exceptIds.push(($scope.post.comments)[i]._id)
            }
            let moreFlag = exceptIds.length > 0;
            if (moreFlag) {
                oldHeight = $('.comment_content_post_'+$scope.post._id)[0].scrollHeight;
            }
            $scope.post.loadingComment = true;
            $http.get('/api/post/'+$scope.post._id+'/get_comment', {
                params : {
                    "exceptIds[]" : exceptIds
                }
            })
            .then(function(res){
                $scope.post.comments = 
                    $scope.post.comments ? $scope.post.comments.concat(res.data)
                    : res.data;
                $scope.post.loadingComment = false;
                if (!moreFlag) {
                    scrollToBottom('.comment_content_post_'+$scope.post._id);   
                } else {
                    setTimeout(function(){
                        $('.comment_content_post_'+$scope.post._id).scrollTop($('.comment_content_post_'+$scope.post._id)[0].scrollHeight - oldHeight);
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

    Scopes.store('scopeCommentPostBox', $scope);
})