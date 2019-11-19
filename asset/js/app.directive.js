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

app.directive('ckEditorComment', function() {
  return {
    require: '?ngModel',
    link: function(scope, elm, attr, ngModel) {
      var ck = CKEDITOR.replace(elm[0], {
        on: { 
          instanceReady: function(ev) {  }
        },
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

app.directive('ckEditorQuestionQuiz', function() {
  return {
    require: '?ngModel',
    link: function(scope, elm, attr, ngModel) {
      var ck = CKEDITOR.replace(elm[0], {
        on: { 
          instanceReady: function(ev) {  }
        },
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

app.directive('fileModel', ['$parse', function ($parse) {
  return {
     restrict: 'A',
     link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;
        
        element.bind('change', function() {
           scope.$apply(function() {
              modelSetter(scope, element[0].files[0]);
           });
        });
     }
  };
}]);

app.directive('enterSubmit', function () {
  return {
    'restrict': 'A',
    'link': function (scope, elem, attrs) {

      elem.bind('keydown', function(event) {
        var code = event.keyCode || event.which;

        if (code === 13) {
          if (!event.shiftKey) {
            event.preventDefault();
            scope.$apply(attrs.enterSubmit);
          }
        }
      });
      
    }
  }
});

app.directive('bindHtml', function() {
  var refresh = function(element) {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, element]);
  };
  return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.bindHtml, function(newValue, oldValue) {
        element.html(newValue);
        refresh(element[0]);
      });
    }
  };
});