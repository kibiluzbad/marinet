'use strict';

angular.module('marinetApp')
  .filter('truncate', function () {
    return function (text, length) {
        if (!text) {
            return text;
        }        
        var message = text;
        if (message.length > length) {
            message = $.trim(text).substring(0, length) + ' ...';
        }
        return message;
    };
});
