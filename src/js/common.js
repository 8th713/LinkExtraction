Object.defineProperties(String.prototype, {
  contains: {
    configurable: true,
    writable: true,
    value: function (str) {
      return this.indexOf(str) >= 0;
    }
  }
});

Object.defineProperties(Array.prototype, {
  contains: {
    configurable: true,
    writable: true,
    value: function (value) {
      return this.indexOf(value) >= 0;
    }
  },
  get: {
    configurable: true,
    writable: true,
    value: function (prop) {
      return this.map(function (item) {
        return item[prop];
      });
    }
  },
  set: {
    configurable: true,
    writable: true,
    value: function (prop, value) {
      this.forEach(function (item) {
        item[prop] = value;
      });
    }
  },
  where: {
    configurable: true,
    writable: true,
    value: function (options) {
      return this.filter(function (item) {
        for (var prop in options) {
          if (item[prop] !== options[prop]) {
            return false;
          }
        }
        return true;
      });
    }
  }
});
