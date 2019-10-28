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

    Scopes.store('scopeListFriend', $scope);
});