var app = angular.module('app', [
    'ngRoute', 'ui.bootstrap', 'datetime', 'ngAnimate', 'ngSanitize'
]);

app.run(function($rootScope, $http, socket){
    $http.get("api/current_user")
    .then(function(response) {
        $rootScope.current_user = response.data;
    });

    socket.init();
    socket.on('announce', function(data){
        console.log(data);
    })
});

app.controller('mainCtrl', function($scope, $location, Scopes) {
    $scope.stringSearch = "";
    $scope.search = function(string){
        $location.path('/search').search({string: string});
    }
    Scopes.store('scopeMainCtrl', $scope);
});