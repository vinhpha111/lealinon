var app = angular.module('app', [
    'ngRoute'
]);

app.controller('mainCtrl', function($scope, $rootScope, $http) {
    $http.get("api/current_user")
    .then(function(response) {
        $rootScope.current_user = response.data;
        console.log(response.data);
    });
})