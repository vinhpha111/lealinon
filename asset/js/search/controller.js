app.controller('searchController', function($scope, $location, Scopes, $http){
    var string = $location.search().string.toString();
    Scopes.get('scopeMainCtrl').stringSearch = string;
    $scope.string = string;
    $scope.type = 'all';
    $scope.datas = [];
    $scope.loading = false;
    var type = $location.search().type;
    if (['all', 'group', 'user', 'post'].indexOf(type) !== -1) {
        $scope.type = type;
    }

    $scope.changeType = function(t){
        if ($scope.type !== t) {
            console.log('change type' + t);
            $location.path('/search').search({string: string, type: t});
        }
    }

    let exceptIds = [];
    function search() {
        $scope.loading = true;
        $http.get('/api/search/by_string', {
            params: {
                string: $scope.string,
                exceptIds: exceptIds,
                type: $scope.type
            }
        })
        .then(function(res){
            $scope.datas = $scope.datas.concat(res.data);
            for(let i in res.data){
                exceptIds.push(res.data._id);
            }
            $scope.loading = false;
        }, function(res){
            $scope.loading = false;
        })
    }

    search();
})