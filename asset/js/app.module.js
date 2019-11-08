var app = angular.module('app', [
    'ngRoute', 'ui.bootstrap', 'datetime', 'ngAnimate', 'ngSanitize'
]);

app.run(function($rootScope, $http, socket, $location, Scopes){
    $rootScope.getCurrentUser = function(){
        $http.get("api/user/current_user")
        .then(function(response) {
            $rootScope.current_user = response.data;
        });
    }
    $rootScope.getCurrentUser();

    socket.init();
    socket.on('announce', function(data){
        console.log(data);
    });
    $rootScope.$on('$routeChangeStart', function($event, next, current) {
        if($location.path() !== '/search') {
            Scopes.get('scopeMainCtrl').stringSearch = ''; 
        };
    });
});

app.controller('mainCtrl', function($scope, $location, Scopes, seoInfo) {
    $scope.stringSearch = "";
    $scope.search = function(string){
        $location.path('/search').search({string: string});
    }
    Scopes.store('scopeMainCtrl', $scope);

    $scope.seoInfo = seoInfo;

    $scope.menuPhoneButton = function(){
        setTimeout(function(){
            $scope.$apply(function(){
                $scope.openMenuPhone = true;
            })
        }, 10);
    }

    $scope.$on('$routeChangeStart', function (event, current, previous) {
        seoInfo.setTitle(current.$$route.title);
        $scope.openMenuPhone = false;
    });
});