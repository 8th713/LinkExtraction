/* global type, target */
(function () {
  var doc, url = location.href;

  window.NodeList.prototype.map = Array.prototype.map;

  function createItem(element) {
    return {
      checked: true,
      source: url,
      tag: element.localName,
      url: (element[this.attr] || element.getAttribute(this.attr)).replace(/#.*/, '')
    };
  }

  function getSelected() {
    var selection, range;

    selection = window.getSelection();
    if (!selection.rangeCount) {
      return document.createDocumentFragment();
    }
    range = selection.getRangeAt(0);
    if (range.collapsed) {
      return document.createDocumentFragment();
    }
    return range.cloneContents();
  }

  function extract(doc) {
    var links, sources;

    links   = doc.querySelectorAll('*[href]').map(createItem, { attr: 'href' });
    sources = doc.querySelectorAll('*[src]').map(createItem, { attr: 'src' });

    links = links.concat(sources);
    return links;
  }

  if (type === 'frame' && target !== url) {
    return {};
  }

  doc = (type === 'selection') ? getSelected() : document;
  return {
    items: extract(doc),
    url: url
  };
}());
