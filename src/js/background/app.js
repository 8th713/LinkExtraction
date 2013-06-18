'use strict';

chrome.contextMenus.onClicked.addListener(onClicked);
chrome.runtime.onInstalled.addListener(onInstalled);

function onClicked(info, tab) {
  var defaults = {
    type: 'popup',
    left: 0,
    top: 0,
    width: 480,
    height: 640
  };

  info.tabId = tab.id;
  chrome.storage.local.get(defaults, function (config) {
    var str = JSON.stringify(info);

    str = encodeURIComponent(str);
    config.url = 'panel/index.html?info=' + str;
    chrome.windows.create(config);
  });
}

function onInstalled(details) {
  var patterns, menus;

  patterns = ["http://*/*", "https://*/*"];
  menus = [
    { id: 'page',      title: 'このページのリンクを抽出',   contexts: ["page"] },
    { id: 'frame',     title: 'このフレームのリンクを抽出', contexts: ["frame"] },
    { id: 'selection', title: '選択範囲のリンクを抽出',     contexts: ["selection"] }
  ];

  menus.forEach(function (props) {
    props.documentUrlPatterns = patterns;
    chrome.contextMenus.create(props);
  });


  if (details.reason !== 'update') {
    return;
  }

  if (details.previousVersion.slice(0, 1) === '0') {
    chrome.storage.local.clear();
    console.log('Delete old version config');
  }
}
