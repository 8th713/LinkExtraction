angular.module('app.filters', [])
.filter('test', [function () {
  return function (items, matchs) {
    var result = items, texts, fn;

    if (matchs.source) {
      result = result.where({source: matchs.source});
    }

    var tags = _.chain(matchs.tags)
      .map(function (val, key) {
        return val ? key : null;
      })
      .compact()
      .value();

    result = result.filter(function (item) {
      return tags.contains(item.tag);
    });

    texts = _.uniq(matchs.texts);
    if (texts.length) {
      fn = this.config.searchType === 'AND' ? 'every' : 'some';

      result = result.filter(function (item) {
        return texts[fn](function (text) {
          return item.url.contains(text);
        });
      });
    }

    var sortProp = matchs.sort || 'index';

    result = _.sortBy(result, function (item) {
      return item[sortProp];
    });

    this.shown   = result;
    this.checked = result.where({checked: true});
    return result;
  };
}]);
