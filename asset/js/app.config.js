app
.config(['$routeProvider', '$locationProvider',
function config($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');

    $routeProvider.
    when('/detail', {
        templateUrl: 'js/detail/detail.html'
    })

    .when('/group/new', {
        templateUrl: 'js/group/new.html',
        controller: 'newGroup'
    })

    .when('/404.html', {
        templateUrl: 'js/error/404.html'
    })
    .otherwise('/404.html');
}
]);