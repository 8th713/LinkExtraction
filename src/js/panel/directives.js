angular.module('app.directives', [])
.directive('myGroup', [function () {
  return {
    scope: true,
    link: function(scope, el, attrs) {
      scope.$watch(attrs.myGroup, function (newVal, oldVal) {
        var tags = scope.matchs.tags, inactive;

        if (Object.keys(oldVal).length) {
          _.each(oldVal, function (val, key) {
            if (!newVal.hasOwnProperty(key)) {
              delete tags[key];
            }
          });
        } else {
          inactive = scope.config.inactives;

          _.each(newVal, function (val, key) {
            tags[key] = !inactive.contains(key);
          });
        }
      }, true);
    }
  };
}])
.directive('myMenu', [function () {
  return function (scope, $el, attrs) {
    var handler = _.debounce(function () {
      scope[attrs.myMenu] = !scope[attrs.myMenu];
      scope.$apply();
    }, 0);

    $el.bind('click', handler);
  };
}]);
