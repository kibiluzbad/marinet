'use strict';

angular.module('marinetApp')
  .directive('buttonCheck', function () {
    return {
        link: function (scope, element, attrs) {
            return $(element).iButton();
        }
    };
});
