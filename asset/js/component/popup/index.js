app.component('myPopup', {
    templateUrl: 'js/component/popup/template.html',
    controller: 'popupController',
});

app.controller('popupController', function($scope, $attrs, Scopes){
    Scopes.store('scopepopup', $scope);
})