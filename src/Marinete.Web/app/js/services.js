'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('marinetServices', ['ngResource']).
    factory('Apps', function ($resource) {
        return $resource('http://localhost:5252/api/account/apps?callback=jsonp_callback', {}, {
            query: { method: 'GET', isArray: true }
        });
    });