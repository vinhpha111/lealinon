app.directive('ckEditor', function() {
  return {
    require: '?ngModel',
    link: function(scope, elm, attr, ngModel) {
      var ck = CKEDITOR.replace(elm[0]);
      
      if (!ngModel) return;
      
      ck.on('pasteState', function() {
        scope.$apply(function() {
          ngModel.$setViewValue(ck.getData());
        });
      });
      
      ngModel.$render = function(value) {
        ck.setData(ngModel.$viewValue);
      };
    }
  };
});

app.directive('ckEditorQuestionQuiz', function() {
  return {
    require: '?ngModel',
    link: function(scope, elm, attr, ngModel) {
      var ck = CKEDITOR.replace(elm[0], {
        toolbarGroups : [
          { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
          { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
          { name: 'others' },
        ],
          height: 100
      });
      
      if (!ngModel) return;
      
      ck.on('pasteState', function() {
        scope.$apply(function() {
          ngModel.$setViewValue(ck.getData());
        });
      });
      
      ngModel.$render = function(value) {
        ck.setData(ngModel.$viewValue);
      };
    }
  };
});

app.directive('ckEditorAnswerQuiz', function() {
  return {
    require: '?ngModel',
    link: function(scope, elm, attr, ngModel) {
      var ck = CKEDITOR.replace(elm[0], {
        toolbarGroups : [
          { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
          { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
          { name: 'others' },
      ],
      height: 70,
      padding: 5,
      removePlugins: 'elementspath',
      resize_enabled: false,
      });
      
      if (!ngModel) return;
      
      ck.on('pasteState', function() {
        scope.$apply(function() {
          ngModel.$setViewValue(ck.getData());
        });
      });
      
      ngModel.$render = function(value) {
        ck.setData(ngModel.$viewValue);
      };
    }
  };
});