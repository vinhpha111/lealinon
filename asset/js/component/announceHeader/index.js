app.component('announceHeader', {
    templateUrl: 'js/component/announceHeader/template.html',
    controller: 'announceHeaderController',
});

function announceType(name) {
    switch (name) {
        case 'INVITED_JOIN_GROUP':
        return 1;
        break;
        case 'INVITED_MAKE_FRIEND':
        return 2;
        break;
        case 'ACCEPTED_MAKE_FRIEND':
        return 3;
        break;
        case 'REFUSED_MAKE_FRIEND':
        return 4;
        break;
        case 'HAS_ONE_COMMENT_IN_POST':
        return 5;
        break;
        case 'HAS_ONE_COMMENT_IN_GROUP':
        return 6;
        break;
        case 'HAS_MESSAGE':
        return 7;
        break;
        case 'HAS_FEEL_IN_POST':
        return 8;
        break;
        
        default:
        return null;
        break;
    }
}

app.controller('announceHeaderController', function($scope, $rootScope, Scopes, $http){
    $scope.user = $rootScope.current_user;
    $scope.announce = {};
    $scope.announce.data = [];
    $scope.announce.exceptIds = [];
    $scope.announce.hasNew = false;
    $scope.announce.numNew = 0;

    function convertAnnounce(data){
        let link = null;
        let content = null;
        switch (data.type) {
            case announceType('INVITED_JOIN_GROUP'):
                link = "/group/"+data.group_id;
                content = data.sender.email + " mời bạn tham gia nhóm";
                break;
        
            default:
                break;
        }
        return {
            html: "<a href='"+link+"'>"+content+"</a>"
        }
    }

    $scope.announce.getList = function(){
        if (!$scope.announce.hasNew) return;

        $scope.announce.data = [];
        $scope.announce.exceptIds = [];
        $scope.announce.hasNew = false;
        $http.get('/api/user/get_announce', {
            params: {
                exceptIds: $scope.announce.exceptIds,
                checkSee: true,
            }
        })
        .then(function(res){
            let datas = res.data;
            console.log(datas);
            for(let i in datas){
                $scope.announce.numNew--;
                $scope.announce.exceptIds.push(datas[i]._id)
                $scope.announce.data.push(convertAnnounce(datas[i]));
            }
            if ($scope.announce.numNew <= 0) {
                $scope.announce.numNew = 0;
                $scope.announce.hasNew = false;
            }
        }, function(res){
        })
    }

    $http.get('/api/user/get_announce')
    .then(function(res){
        let datas = res.data;
        console.log(datas);
        for(let i in datas){
            if(!datas[i].has_see) {
                $scope.announce.hasNew = true;
                $scope.announce.numNew++;
            }
        }
    }, function(res){
    })
    

    Scopes.store('scopeMessage', $scope);
});