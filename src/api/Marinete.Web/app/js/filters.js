'use strict';

/* Filters */
var module = angular.module('marinetFilters', []);

module.filter('newlines', function () {
    return function (text) {
        return text.toString().replace(/\n/g, '<br/>');
    };
});

module.filter('truncate', function () {
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

module.filter('normalizedate', function () {
    return function (jsonDate) {
        if (jsonDate)
            return new Date(parseInt(jsonDate.substr(6)));
    };
});

module.filter('newlines', function () {
    return function (text) {
        return text.toString().replace(/\n/g, '<br/>');
    };
});