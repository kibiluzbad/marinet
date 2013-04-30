'use strict';

/* Services */


angular.module('SharedServices', [])
    .config(function ($httpProvider) {
        $httpProvider.responseInterceptors.push('myHttpInterceptor');
        var spinnerFunction = function (data, headersGetter) {
            // todo start the spinner here
            
            return data;
        };
        $httpProvider.defaults.transformRequest.push(spinnerFunction);
    })
// register the interceptor as a service, intercepts ALL angular ajax http calls
    .factory('myHttpInterceptor', function ($q, $window) {
        return function (promise) {
            return promise.then(function (response) {
                // do something on success
                // todo hide the spinner
            
                return response;

            }, function (response) {
                // do something on error
                // todo hide the spinner
            
                return $q.reject(response);
            });
        };
    })

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('marinetServices', ['ngResource']).
    factory('Apps', function ($resource) {
        return $resource('http://localhost:5252/api/account/apps?callback=jsonp_callback', {}, {
            query: { method: 'GET', isArray: true }
        });
    });