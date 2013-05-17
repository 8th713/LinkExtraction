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
    $rootScope.$watch('config.fontSize', watch);
    $rootScope.$apply();
  });

  save = _.debounce(set, 200);

  function watch (newVal, oldVal) {
    if (newVal !== oldVal) {
      obj.fontSize = newVal;
      save();
    }
  }

  function set() {
    storage.set(obj, reset);
  }

  function reset() {
    obj = {};
  }
}]);
