app.component('leftSidebar', {
    templateUrl: 'js/component/sidebar/template.html',
    controller: 'sidebarController',
});

app.controller('sidebarController', function($scope, $rootScope, $http){
    $http.get('/api/group/list_in_sidebar')
    .then(function(res){
        console.log(res)
        $scope.listGroup = res.data;
    })
});