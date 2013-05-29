'use strict';

/* Services */

var services = angular.module('marinet.services', ['ngResource']);

services.factory('Account', ['$resource',
function ($resource) {    
    return $resource('/account/apps?r='+Math.random() * 99999);
} ]);

services.factory('MultiAccountLoader', ['Account',
    '$q',
function (Account, $q) {
    return function () {
        var delay = $q.defer();
        Account.query(function (accounts) {
            delay.resolve(accounts);
        }, function () {
            delay.reject('Unable to fetch accounts');
        });
        return delay.promise;
    };
} ]);
