app
.config(['$routeProvider', '$locationProvider', 'datetimePlaceholder',
function config($routeProvider, $locationProvider, datetimePlaceholder) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');

    $routeProvider.
    when('/detail', {
        templateUrl: 'js/detail/detail.html'
    })

    .when('/group/new', {
        templateUrl: 'js/group/new.html',
        controller: 'newGroup',
        resolve : {
            current_user : async function($auth){
                return await $auth.getUser();
            }
        }
    })

    .when('/group/:id', {
        templateUrl: 'js/group/detail.html',
        controller: 'detailGroup',
        resolve : {
            current_user : async function($auth, $route){
                return await $auth.getUser();
            },
            permission : async function($auth, $route){
                let roleList = [$auth.role.group.ADMIN, $auth.role.group.EDITOR];
                return await $auth.checkPermission.group(roleList, $route.current.params.id);
            }
        }
    })

    .when('/group/:id/new-post', {
        templateUrl: 'js/group/new_post.html',
        controller: 'newPost',
        resolve : {
            current_user : async function($auth){
                return await $auth.getUser();
            },
            permission : async function($auth, $route){
                let roleList = [$auth.role.group.ADMIN, $auth.role.group.EDITOR];
                return await $auth.checkPermission.group(roleList, $route.current.params.id, '/group/'+$route.current.params.id);
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