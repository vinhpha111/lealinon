app.component('alertMessage', {
    templateUrl: 'js/component/alertMessage/template.html',
    controller: 'alertMessageController',
});

app.controller('alertMessageController', function($scope, Scopes){
    $scope.alertMessages = [];

    $scope.remove = function(item){
        let index = $scope.alertMessages.indexOf(item);
        $scope.alertMessages.splice(index, 1);
    }

    Scopes.store('scopeMessage', $scope);
});