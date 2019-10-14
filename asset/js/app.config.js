app
.config(['$routeProvider', '$locationProvider', 'datetimePlaceholder',
function config($routeProvider, $locationProvider, datetimePlaceholder) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');

    $routeProvider.
    when('/detail', {
        templateUrl: 'js/detail/detail.html'
    })

    .when('/search', {
        templateUrl: 'js/search/index.html',
        controller: 'searchController',
        resolve : {
            current_user : function($auth){
                return $auth.getUser();
            },
        }
    })

    .when('/group/new', {
        templateUrl: 'js/group/new.html',
        controller: 'newGroup',
        resolve : {
            current_user : function($auth, $route){
                return $auth.getUser();
            },
        }
    })

    .when('/group/:id', {
        templateUrl: 'js/group/detail.html',
        controller: 'detailGroup',
        resolve : {
            current_user : function($auth, $route){
                return $auth.getUser();
            },
            permission : function($auth, $route){
                let roleList = [$auth.role.group.ADMIN, $auth.role.group.EDITOR];
                return $auth.checkPermission.group(roleList, $route.current.params.id);
            }
        }
    })

    .when('/group/:id/new-post', {
        templateUrl: 'js/group/new_post.html',
        controller: 'newPost',
        resolve : {
            current_user : function($auth){
                return $auth.getUser();
            },
            permission : function($auth, $route){
                let roleList = [$auth.role.group.ADMIN, $auth.role.group.EDITOR];
                return $auth.checkPermission.group(roleList, $route.current.params.id, '/group/'+$route.current.params.id);
            }
        }
    })

    .when('/404.html', {
        templateUrl: 'js/error/404.html'
    })
    .otherwise('/404.html');

    var placeholder = {
        year: "(năm)",
        yearShort: "(năm)",
        month: "(tháng)",
        date: "(ngày)",
        day: "(ngày)",
        hour: "(hh)",
        hour12: "(hh)",
        minute: "(mm)",
        second: "(second)",
        millisecond: "(millisecond)",
        ampm: "(AM/PM)",
        week: "(week)"
    };
    for (let index in placeholder) {
        datetimePlaceholder[index] = placeholder[index];
        
    }
}
]);