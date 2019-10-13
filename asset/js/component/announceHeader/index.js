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

app.controller('announceHeaderController', function($scope, $rootScope, Scopes, $http, socket, Sound){
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
            _id: data._id,
            html: "<a href='"+link+"'>"+content+"</a>"
        }
    }

    function setAnnounceHasSee(ids) {
        $http.post('/api/announce/set_has_see',{
            ids: ids
        }).then();
    }

    $scope.announce.getList = function(){

        
        $scope.announce.data = [];
        $scope.announce.exceptIds = [];
        
        $http.get('/api/announce/find', {
            params: {
                exceptIds: $scope.announce.exceptIds,
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
            setAnnounceHasSee($scope.announce.exceptIds);
        }, function(res){
        })
    }

    $http.get('/api/announce/get_not_see')
    .then(function(res){
        let datas = res.data;
        $scope.announce.numNew = res.data.countNotSee;
        if ($scope.announce.numNew > 0) {
            $scope.announce.hasNew = true;
        }
    }, function(res){
    })
    
    socket.on('announceHeader', function(data){
        console.log(data);
        $scope.$apply(function() { 
            $scope.announce.numNew += 1;
            $scope.announce.hasNew = true;
        });
        Sound.notification();
    });

});