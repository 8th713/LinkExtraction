angular.module('app', [
  'app.settings',
  'app.services',
  'app.filters',
  'app.directives',
  'app.controllers'
])
.run(['$rootScope', function (scope) {
  var data = decodeURIComponent(location.search);

  data = data.slice(6);
  execute(JSON.parse(data));

  function execute(info) {
    var details = {
      code: 'var type="' + info.menuItemId + '",target="' + info.frameUrl + '";',
      allFrames: true
    };

    chrome.tabs.executeScript(info.tabId, details, function () {
      delete details.code;
      details.file = '/content.js';
      chrome.tabs.executeScript(info.tabId, details, executed);
    });

    function executed(list) {
      scope.$broadcast('load', list);
    }
  }
}]);
