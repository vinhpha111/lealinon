app.component('listFriend', {
    templateUrl: 'js/component/listFriend/template.html',
    controller: 'listFriendController',
});

app.controller('listFriendController', function($scope, $rootScope, $http, Scopes){
    $scope.getList = function(){
        $http.get('/api/chat/list_friend')
        .then(function(res){
            $scope.listFriend = res.data;
        });
    };

    $scope.getList();

    $scope.showChatBox = function(user) {
        console.log(user);
        Scopes.get('scopeMainCtrl').openMenuPhone = false;
        Scopes.get('scopeChatBox').init(user);
    }

    Scopes.store('scopeListFriend', $scope);
});