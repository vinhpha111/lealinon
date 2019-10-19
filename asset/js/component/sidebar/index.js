app.component('leftSidebar', {
    templateUrl: 'js/component/sidebar/template.html',
    controller: 'sidebarController',
});

app.controller('sidebarController', function($scope, $rootScope, $http, Scopes){
    $http.get('/api/group/list_in_sidebar')
    .then(function(res){
        $scope.listGroup = res.data;
    });
    
    $scope.getList = function(){
        $http.get('/api/group/list_in_sidebar')
        .then(function(res){
            $scope.listGroup = res.data;
        });
    };

    Scopes.store('scopeSidebar', $scope);
});