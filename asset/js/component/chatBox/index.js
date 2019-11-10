app.component('chatBox', {
    templateUrl: 'js/component/chatBox/template.html',
    controller: 'chatBoxController',
});

app.controller('chatBoxController', async function($scope, $rootScope, $http, Scopes, $auth, socket, $sce){

    $scope.listMessage = [];
    $scope.msg = {content: ''};
    let exceptIds = [];

    getListMessage = function(){
        return $http.get('/api/chat/user/'+$scope.user._id+'/list_message', {
            params: {
                exceptIds: exceptIds,
            }
        })
        .then(function(res){
            let data = res.data;
            for(let i in data) {
                exceptIds.push(data[i]._id);
            }
            $scope.listMessage = data.concat($scope.listMessage);
        })
    }

    $scope.loadMore = function(){
        let oldHeight = $('.chat-box .panel-body')[0].scrollHeight;
        getListMessage().then(function(){
            setTimeout(() => {
                let newHeight = $('.chat-box .panel-body')[0].scrollHeight;
                $('.chat-box .panel-body').scrollTop(newHeight - oldHeight);
            }, 50);
        });
    }

    $scope.init = function(user) {
        $scope.msg.content = '';
        let firstIndex = true;
        for(let index in $scope.emoji.data) {
            if (firstIndex) {
                $scope.emoji.active = index;
                firstIndex = false;
            }
        }
        if ($scope.user) {
            socket.removeListener('message_user_'+$scope.user._id, listenMessage);
        }
        $scope.listMessage = [];
        exceptIds = [];
        $scope.current_user = $rootScope.current_user;
        $scope.user = user;
        $scope.right = $('list-friend').position();
        $scope.show = true;
        getListMessage().then(function(data){
            setTimeout(() => {
                updateScroll();
            }, 500);
        });
        socket.on('message_user_'+$scope.user._id, listenMessage);
    }

    $scope.close = function(){
        $scope.show = false;
        $scope.user = null;
    }

    function listenMessage(message) {
        if ($scope.listMessage.indexOf(message) === -1) {
            $scope.listMessage.push(message);
            setTimeout(() => {
                updateScroll();
            }, 500);   
            }
    }

    function updateScroll(){
        $('.chat-box .panel-body').scrollTop($('.chat-box .panel-body')[0].scrollHeight);
    }

    $scope.sendMessage = function(){
        console.log($scope.msg.content);
        let message = $scope.msg.content.replace(/\n/g, "<br />");
        $scope.msg.content = '';
        if (message.length > 0) {
            $http.post('/api/chat/user/'+$scope.user._id+'/add_message', {
                message: message,
            }).then(function(res) {
                $scope.listMessage.push(res.data);
                setTimeout(() => {
                    updateScroll();
                }, 100);
            }, function(err) {

            })
        }
    }

    $scope.addEmojiToMessage = function(code) {
            let text = $('#'+code).text();

            $scope.msg.content += ' '+text;
    }

    $scope.emoji = {};
    $http.get('/emoji_list.json')
    .then(function(res) {
        console.log(res.data);
        $scope.emoji.data = res.data;
        let firstIndex = true;
        for(let index in $scope.emoji.data) {
            if (firstIndex) {
                $scope.emoji.active = index;
                firstIndex = false;
            }
        }
    });

    Scopes.store('scopeChatBox', $scope);
});