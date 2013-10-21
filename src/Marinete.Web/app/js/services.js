'use strict';

/* Services */

var services = angular.module('marinet.services', ['ngResource']);

services.factory('Account', ['$resource',
    function ($resource) {
        var d = new Date();

        return $resource('/account/:route',
        {
            cacheSlayer: d.getTime(),
            route: 'apps'
    },
            {
                createApp: {
                    method: 'POST',
                    params: {route: 'app'}
                }
            });
    }
]);

services.factory('MultiAccountLoader', ['Account',
    '$q',
function (Account, $q) {
    return function () {
        var delay = $q.defer();
        Account.query(function (accounts, headers) {
            if ("text/html" == headers()["content-type"]) {
                window.location = "/";
                delay.reject('Unable to fetch accounts');
                return;
            }
            delay.resolve(accounts);
        }, function () {
            delay.reject('Unable to fetch accounts');
        });
        return delay.promise;
    };
} ]);
