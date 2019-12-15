app
.config(['$routeProvider', '$locationProvider', 'datetimePlaceholder',
function config($routeProvider, $locationProvider, datetimePlaceholder) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');

    $routeProvider
    .when('/', {
        template: "<h1>Hello! this is index</h1>"
    })

    .when('/test-seo', {
        template: "<h1>Hello! this is index</h1>"
    })

    .when('/detail', {
        templateUrl: 'js/detail/detail.html'
    })

    .when('/search', {
        title: 'Tìm kiếm',
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

    .when('/group/:id/management', {
        templateUrl: 'js/group/management.html',
        controller: 'managementGroup',
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

    .when('/essay/:id', {
        templateUrl: 'js/post/detailEssay.html',
        controller: 'detailEssay',
        resolve : {
            current_user : function($auth){
                return $auth.getUser();
            },
        }
    })

    .when('/essay_answer/:id', {
        templateUrl: 'js/post/detailEssayAnswer.html',
        controller: 'detailEssayAnswer',
        resolve : {
            current_user : function($auth){
                return $auth.getUser();
            },
        }
    })

    .when('/essay/:id/do', {
        templateUrl: 'js/post/doEssay.html',
        controller: 'doEssay',
        resolve : {
            current_user : function($auth){
                return $auth.getUser();
            },
        }
    })

    .when('/quiz/:id', {
        templateUrl: 'js/post/detailQuiz.html',
        controller: 'detailQuiz',
        resolve : {
            current_user : function($auth){
                return $auth.getUser();
            },
        }
    })

    .when('/quiz/:id/do', {
        templateUrl: 'js/post/doQuiz.html',
        controller: 'doQuiz',
        resolve : {
            current_user : function($auth){
                return $auth.getUser();
            },
        }
    })

    .when('/user/:id', {
        templateUrl: 'js/user/profile.html',
        controller: 'profileUser',
        resolve : {
            current_user : function($auth){
                return $auth.getUser();
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