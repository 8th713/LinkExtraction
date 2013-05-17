angular.module('app.controllers', [])
.controller('MainCtrl', ['$scope', '$filter', 'converts', 'config',
function ($scope, $filter, converts, config) {
  $scope.matchs  = {
    texts: [],
    tags: {},
    source: null,
    sort: false
  };

  $scope.items   = [];
  $scope.shown   = [];
  $scope.checked = [];
  $scope.sources = {};
  $scope.tags    = {};

  $scope.$on('load', function (evt, response) {
    $scope.sources = converts.toSources(response);
    $scope.items   = converts.toItems(response);
    $scope.tags    = converts.toTags($scope.items);
    $scope.$apply();
  });

  $scope.filter = $filter('test');

  $scope.getShownItems = function () {
    return this.filter(this.items, this.matchs);
  };

  $scope.getCheckedItems = function () {
    return this.getShownItems().where({checked: true});
  };


  $scope.copy = function () {
    var urls = this.getCheckedItems().get('url');

    var textbox = document.createElement('textarea');

    textbox.value = urls.join('\r\n');
    textbox.style.cssText='position: absolute;left: -100%;';
    document.body.appendChild(textbox);
    textbox.focus();
    textbox.select();
    document.execCommand("Copy");
    document.body.removeChild(textbox);
  };

  $scope.open = function (evt) {
    var urls = this.getCheckedItems().get('url'),
      delay = config.delayTime,
      isNew = evt.shiftKey ? !config.createNewWindow : config.createNewWindow,
      createProp = {
        url: urls.shift()
      };

    function open() {
      var method = isNew ? 'windows' : 'tabs';

      chrome[method].create(createProp, function (win) {
        isNew = false;
        createProp.url = urls.shift();
        createProp.active = false;
        createProp.windowId = win.windowId || win.id;
        if (createProp.url) {
          setTimeout(open, delay);
        }
      });
    }

    open();
  };

  $scope.add = function () {
    var str = this.matchs.texts.join(' ');

    if (config.patterns.contains(str)) {
      return;
    }
    config.patterns.push(str);
    chrome.storage.local.set({
      patterns: config.patterns
    });
  };


  $scope.check = function () {
    this.getShownItems().set('checked', true);
  };

  $scope.uncheck = function () {
    this.getShownItems().set('checked', false);
  };

  $scope.remove = function () {
    this.items = _.difference(this.items, this.getCheckedItems());
    this.tags  = converts.toTags(this.items);
  };

  $scope.saveSize = function () {
    var info = {
      top:    window.screenTop,
      left:   window.screenLeft,
      width:  window.innerWidth,
      height: window.innerHeight
    };

    _.extend(config, info);
    chrome.storage.local.set(info);
  };
}]);
