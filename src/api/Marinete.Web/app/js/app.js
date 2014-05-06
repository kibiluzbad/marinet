'use strict';

angular.module('marinet', ['marinetFilters',
    'ngSanitize',
    'marinet.services',
    'SharedServices',
    'marinet.directives',
    'infinite-scroll']).
    config(['$routeProvider','$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.when('/apps',
            {
                templateUrl: '/app/partials/apps.html',
                controller: 'AppsController',
                resolve: {
                    apps: function(MultiAccountLoader) {
                        return MultiAccountLoader();
                    }
                }
            });
        $routeProvider.when('/:appName/errors', { templateUrl: '/app/partials/errors.html', controller: 'ErrorsController' });
        $routeProvider.when('/:appName/errors/:slug', { templateUrl: '/app/partials/error.html', controller: 'ErrorController' });
        $routeProvider.otherwise({ redirectTo: '/apps' });
    }]);

angular.module('SharedServices', [])
    .config(function ($httpProvider) {
        $httpProvider.responseInterceptors.push('myHttpInterceptor');
        var spinnerFunction = function (data, headersGetter) {
            // todo start the spinner here
            //alert('start spinner');
            //$('#mydiv').show();
            return data;
        };
        $httpProvider.defaults.transformRequest.push(spinnerFunction);
    })
// register the interceptor as a service, intercepts ALL angular ajax http calls
    .factory('myHttpInterceptor', function ($q, $window) {
        return function (promise) {
            return promise.then(function (response) {
                return response;

            }, function (response) {
                if (401 === response.status) window.location = "/login";
                return $q.reject(response);
            });
        };
    });