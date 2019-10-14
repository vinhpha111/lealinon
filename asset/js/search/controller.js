app.controller('searchController', function($scope, $location, Scopes, $http){
    var string = $location.search().string;
    Scopes.get('scopeMainCtrl').stringSearch = string;
    $scope.string = string;
    $scope.type = 'all';
    $scope.data = [];
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

    function search() {
        $http.get('/api/search', {
            params: {
                string: $scope.string,
                type: $scope.type
            }
        })
        .then(function(res){
            $scope.data = res.data;
        }, function(res){
            $scope.data = [];
        })
    }

})