app.component('chatBox', {
    templateUrl: 'js/component/chatBox/template.html',
    controller: 'chatBoxController',
});

app.controller('chatBoxController', async function($scope, $rootScope, $http, Scopes, $auth){

    $scope.listMessage = [];

    $scope.getListMessage = function(){
        return $http.get('/api/chat/user/'+$scope.user._id+'/list_message')
        .then(function(res){
            let data = res.data;
            $scope.listMessage = data.concat($scope.listMessage);
        }, function(err){

        })
    }

    $scope.init = function(user) {
        $scope.current_user = $rootScope.current_user;
        $scope.user = user;
        $scope.right = $('list-friend').position();
        $scope.show = true;
        $scope.getListMessage().then(function(data){
            updateScroll();
        });
    }

    $scope.close = function(){
        $scope.show = false;
    }

    function updateScroll(){
        $('.chat-box .panel-body').scrollTop($('.chat-box .panel-body')[0].scrollHeight);
    }

    Scopes.store('scopeChatBox', $scope);
});