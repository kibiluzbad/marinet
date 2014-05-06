'use strict';

angular.module('marinetApp')
  .filter('normalizedate', function () {
    return function (jsonDate) {
        if (jsonDate)
            return new Date(parseInt(jsonDate.substr(6)));
    };
});
