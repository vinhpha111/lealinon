app.controller('newGroup', function($scope, $location, $window, $http, current_user, Scopes) {
    if (!current_user) {
        $window.location.href = '/login';
    }

    $scope.new = function(){
        let formData = new FormData();
        formData.append('name', $scope.name);
        formData.append('description', $scope.description);
        $http.post('/api/group/new', {
            name : $scope.name,
            description : $scope.description,
        })
        .then(function(res){
            $scope.errors = null;
            Scopes.get('scopeSidebar').getList();
            $location.path("/detail");

        }, function(res){
            $scope.errors = res.data.errors
        });
    }
});

app.controller('detailGroup', function($scope, $routeParams, $http, Scopes) {
    $scope.id = $routeParams.id;
    $scope.notFound = false;
    $scope.exceptIds = [];
    $scope.listPost = [];
    $scope.loadingPost = false;
    $http.get('/api/group/get_by_id/'+$routeParams.id)
    .then(function(res){
        $scope.detail = res.data;
    }, function(res){
        $scope.detail = null;
        $scope.notFound = true;
        console.log(res);
    });

    $scope.getPost = function(){
        if ($scope.loadingPost) {
            return;
        }
        $scope.loadingPost = true;
        $http.get('/api/group/'+$routeParams.id+'/list_post', {
            params: { exceptIds : $scope.exceptIds }
        })
        .then(function(res){
            for(let i in res.data){
                $scope.listPost.push(res.data[i]);
                $scope.exceptIds.push(res.data[i]._id);
            }
            $scope.loadingPost = false;
            console.log(res);
        }, function(res){
            $scope.loadingPost = false;
            console.log(res);
        })
    }
    $scope.getPost();
    
    $scope.invite = {};
    $scope.invite.searchingUser = false;
    $scope.invite.listFindUserInvite = null;
    $scope.invite.stringFindUserInvite = '';
    $scope.searchUser = function(){
        console.log($scope.invite.stringFindUserInvite);
        if ($scope.invite.searchingUser) {
            return;
        }
        $scope.invite.searchingUser = true;
        $http.get('/api/user/find', {
            params: { string : $scope.invite.stringFindUserInvite }
        })
        .then(function(res){
            $scope.invite.listFindUserInvite = res.data;
            $scope.invite.searchingUser = false;
            console.log(res);
        }, function(res){
            $scope.invite.searchingUser = false;
            console.log(res);
        })
    }

    $scope.inviteUserJoinGroup = function(){
        let ids = [];
        for(let i in $scope.invite.listFindUserInvite){
            if ($scope.invite.listFindUserInvite[i].checked) {
                ids.push($scope.invite.listFindUserInvite[i]._id);
            }
        }
        if (ids.length > 0) {
            $scope.invite.stringFindUserInvite = null;
            $scope.invite.listFindUserInvite = null;
            $scope.invite.introduce = null;
            $http.post('/api/group/'+$routeParams.id+"/invite_member",{
                ids : ids,
                introduce : $scope.invite.introduce
            })
            .then(function(res){
                Scopes.get('scopeMessage').alertMessages = [
                    {
                        type: 'success',
                        content: 'Đã gửi lời mời tham gia nhóm!'
                    }
                ];
            }, function(res){
                Scopes.get('scopeMessage').alertMessages = [
                    {
                        type: 'danger',
                        content: 'Có lỗi xãy ra, hãy thử lại!'
                    }
                ];
            })
        }
    }

    $scope.invite.canSendInvite = false;
    $scope.checkSendInvite = function(){
        for(let i in $scope.invite.listFindUserInvite){
            if ($scope.invite.listFindUserInvite[i].checked) {
                $scope.invite.canSendInvite = true;
                console.log($scope.invite.canSendInvite);
                return;
            }
        }
        $scope.invite.canSendInvite = false;
    }

});

app.controller('newPost', function($routeParams, $scope, current_user, $location, $window, $http) {
    if (!current_user) {
        $window.location.href = 'login?redirect='+$location.$$absUrl
    }
    var id = $routeParams.id;
    $scope.id = id;
    $scope.type = 'exam';
    $scope.exam_type = 'essay';

    $scope.essay = {};
    $scope.addEssay = () => {
        $http.post('/api/group/'+id+'/new_essay', $scope.essay)
        .then(function(res){
            $scope.errors = null;
            $location.path('/group/'+id);
            console.log(res);
        }, function(res){
            console.log(res);
            $scope.errors = res.data.errors;
        });
    }

    $scope.$on('$routeChangeStart', function($event, next, current) { 
        console.log('route change');
      });
});