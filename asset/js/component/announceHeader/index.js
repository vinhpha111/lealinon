app.component('announceHeader', {
    templateUrl: 'js/component/announceHeader/template.html',
    controller: 'announceHeaderController',
});

function announceType(name) {
    switch (name) {
        case 'INVITED_JOIN_GROUP':
        return 1;
        break;
        case 'ASK_JOIN_GROUP':
        return 2;
        break;
        case 'ACCEPTED_JOIN_GROUP':
        return 3;
        break;
        case 'REFUSED_JOIN_GROUP':
        return 4;
        break;
        case 'REMOVED_FROM_GROUP':
        return 5;
        break;
        case 'AGREE_JOIN_GROUP':
        return 6;
        break;
        case 'INVITED_MAKE_FRIEND':
        return 7;
        break;
        case 'ACCEPTED_MAKE_FRIEND':
        return 8;
        break;
        case 'REFUSED_MAKE_FRIEND':
        return 9;
        break;
        case 'HAS_ONE_COMMENT_IN_POST':
        return 10;
        break;
        case 'HAS_ONE_COMMENT_IN_GROUP':
        return 11;
        break;
        case 'HAS_MESSAGE':
        return 12;
        break;
        case 'HAS_FEEL_IN_POST':
        return 13;
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
                link = "/group/"+data.group_id._id;
                content = "<strong>"+data.sender.name+"</strong>"
                        + " mời bạn tham gia nhóm " 
                        + "<strong>"+data.group_id.name+"</strong>";
                break;
            case announceType('ASK_JOIN_GROUP'):
                link = "/group/"+data.group_id._id+"/management";
                content = "<strong>"+data.sender.name+"</strong>"
                        + " muốn tham gia nhóm "
                        + "<strong>"+data.group_id.name+"</strong>";
                break;
            case announceType('ACCEPTED_JOIN_GROUP'):
                link = "/group/"+data.group_id._id;
                content = "<strong>"+data.sender.name+"</strong>"
                        + " đã cho phép bạn tham gia nhóm "
                        + "<strong>"+data.group_id.name+"</strong>";
                break;
            case announceType('REFUSED_JOIN_GROUP'):
                link = "#";
                content = "<strong>"+data.sender.name+"</strong>"
                        + " đã hủy yêu cầu tham gia nhóm "
                        + "<strong>"+data.group_id.name+"</strong> của bạn";
                break;
            case announceType('REMOVED_FROM_GROUP'):
                link = "#";
                content = "<strong>"+data.sender.name+"</strong>"
                        + " đã loại bạn ra khỏi nhóm "
                        + "<strong>"+data.group_id.name+"</strong>";
                break;
            case announceType('AGREE_JOIN_GROUP'):
                link = "#";
                content = "<strong>"+data.sender.name+"</strong>"
                        + " đã đồng ý tham gia "
                        + "<strong>"+data.group_id.name+"</strong>";
                break;
            case announceType('INVITED_MAKE_FRIEND'):
                link = "/user/"+data.sender._id;
                content = "<strong>"+data.sender.name+"</strong>"
                        + " đã gửi lời mời kết bạn đến bạn."
                break;
            case announceType('ACCEPTED_MAKE_FRIEND'):
                link = "/user/"+data.sender._id;
                content = "<strong>"+data.sender.name+"</strong>"
                        + " đã chấp nhận yêu cầu kết bạn của bạn."
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
        $http.put('/api/announce/set_has_see',{
            ids: ids
        }).then();
    }

    $scope.announce.getList = function(){

        
        $scope.announce.data = [];
        $scope.announce.exceptIds = [];
        $scope.announce.load = true;
        
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
            $scope.announce.load = false;
            setAnnounceHasSee($scope.announce.exceptIds);
        }, function(err){
            $scope.announce.load = false;
        })
    }

    $scope.announce.loadMore = function(){
        $scope.announce.load = true;
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
            $scope.announce.load = false;
            setAnnounceHasSee($scope.announce.exceptIds);
        }, function(err){
            $scope.announce.load = false;
        })
    }

    $http.get('/api/announce/get_not_see')
    .then(function(res){
        let datas = res.data;
        $scope.announce.numNew = res.data.countNotSee;
        if ($scope.announce.numNew > 0) {
            $scope.announce.hasNew = true;
        }
    }, function(err){
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