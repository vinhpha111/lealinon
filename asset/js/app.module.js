var app = angular.module('app', [
    'ngRoute', 'ui.bootstrap', 'datetime', 'ngAnimate', 'ngSanitize'
]);

app.run(function($rootScope, $http){
    $http.get("api/current_user")
    .then(function(response) {
        $rootScope.current_user = response.data;
    });
});

app.controller('mainCtrl', function($scope, $rootScope, $http) {
    
});