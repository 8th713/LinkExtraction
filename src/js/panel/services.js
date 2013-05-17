angular.module('app.services', [])
.factory('converts', [function () {
  return {
    toSources: function (response) {
      var result = {};

      _.chain(response)
        .pluck('url').compact().uniq()
        .each(function (val) {
          var prefix = val.slice(0, 31),
              suffix = val.slice(-31),
              label  = prefix + '...' + suffix;

          label = val.length < 65 ? val : label;
          result[label] = val;
        });

      return result;
    },
    toItems: function (response) {
      return _.chain(response)
        .pluck('items')
        .flatten()
        .compact()
        .uniq(false, function (item, index) {
          item.index = index;
          return item.url;
        })
        .value();
    },
    toTags: function (items) {
      var result = {};

      _.chain(items).pluck('tag').countBy()
        .each(function (count, name) {
          result[name] = name + '(' + count + ')';
        });

      return result;
    }
  };
}]);
