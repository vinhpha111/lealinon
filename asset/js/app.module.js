var app = angular.module('app', [
    'ngRoute', 'ui.bootstrap'
]);

app.run(function($rootScope, $http){
    $http.get("api/current_user")
    .then(function(response) {
        $rootScope.current_user = response.data;
    });

    var $scope = $rootScope;

    $scope.today = function() {
        $scope.dt = new Date();
      };
      $scope.today();
    
      $scope.clear = function() {
        $scope.dt = null;
      };
    
      $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
      };
    
      $scope.dateOptions = {
        // dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
      };
    
      // Disable weekend selection
      function disabled(data) {
        var date = data.date,
          mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
      }
    
      $scope.toggleMin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
      };
    
      $scope.toggleMin();
    
      $scope.open1 = function() {
        $scope.popup1.opened = true;
      };
    
      $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
      };
    
      $scope.formats = ['dd/MM/yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];
      $scope.altInputFormats = ['M!/d!/yyyy'];
    
      $scope.popup1 = {
        opened: false
      };
    
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var afterTomorrow = new Date();
      afterTomorrow.setDate(tomorrow.getDate() + 1);
      $scope.events = [
        {
          date: tomorrow,
          status: 'full'
        },
        {
          date: afterTomorrow,
          status: 'partially'
        }
      ];
    
      function getDayClass(data) {
        var date = data.date,
          mode = data.mode;
        if (mode === 'day') {
          var dayToCheck = new Date(date).setHours(0,0,0,0);
    
          for (var i = 0; i < $scope.events.length; i++) {
            var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);
    
            if (dayToCheck === currentDay) {
              return $scope.events[i].status;
            }
          }
        }
    
        return '';
      }

      $rootScope.$watch(function(){
          return $scope.popup1;
      }, function(oldVal, newVal){
          console.log(oldVal);
          console.log(newVal);
      });

});

app.controller('mainCtrl', function($scope, $rootScope, $http) {
    
});

app.directive('myCustomer', function() {
  return {
    restrict : "E",
    template:   //'<p class="input-group">'
                '    <input ng-click="open1()" readOnly="true" type="text" class="form-control" uib-datepicker-popup="{{format}}" ng-model="var" is-open="popup1.opened" datepicker-options="dateOptions" ng-required="true" close-text="Close" alt-input-formats="altInputFormats" />'
                //+'    <span class="input-group-btn">'
                //+'    <button type="button" class="btn btn-default" ng-click="open1()"><i class="glyphicon glyphicon-calendar"></i></button>'
                //+'    </span>'
                //+'</p>'
  };
});