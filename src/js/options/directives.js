angular.module('app.directives', [])
.directive('myForm', ['$timeout', function ($timeout) {
  return {
    scope: true,
    link: function(scope, el, attrs) {
      var prop = attrs.myForm;

      scope.remove = function (val) {
        var old = this.config[prop];

        this.config[attrs.myForm] = old.filter(function (tag) {
          return tag !== val;
        });
      };

      scope.add = function () {
        var model = this.config[prop];

        if (model.contains(this.inputStr)) {
          this.message = '既に存在します';
          $timeout.cancel();
          $timeout(function () {
            scope.message = null;
          }, 5000);
          return;
        }
        model.push(this.inputStr);
        this.inputStr = '';
      };

      scope.hide = function () {
        $timeout.cancel();
        this.message = null;
      };
    }
  };
}]);
