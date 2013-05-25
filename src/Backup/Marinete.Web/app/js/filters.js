'use strict';

/* Filters */

angular.module('marinetFilters', []).filter('newlines', function () {
    return function (text) {
        return text.toString().replace(/\n/g, '<br/>');
    };
});

angular.module('marinetFilters', []).filter('normalizedate', function () {
    return function (jsonDate) {
        if (jsonDate)
        return new Date(parseInt(jsonDate.substr(6)));
    };
});


