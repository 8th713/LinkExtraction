angular.module('app.settings', [])
.value('config', {
  type: 'popup',
  left: 0,
  top: 0,
  width: 480,
  height: 640,
  fontSize: "14px",
  createNewWindow: true,
  delayTime: 500,
  searchType: 'OR',
  patterns: ['.png .jpg .gif'],
  inactives: ['link', 'script']
})
.run(['$rootScope', 'config', function ($rootScope, config) {
  var storage = chrome.storage.local,
      obj = {}, save;

  $rootScope.config = config;
  storage.get(null, function (items) {
    _.extend(config, items);
    _.each(config, watch, $rootScope);
    $rootScope.$apply();
  });

  save = _.debounce(set, 200);

  function watch(val, key) {
    this.$watch('config.' + key, function (newVal, oldVal) {
      if (newVal !== oldVal) {
        obj[key] = newVal;
        save();
      }
    }, true);
  }

  function set() {
    storage.set(obj, reset);
  }

  function reset() {
    obj = {};
  }
}]);
