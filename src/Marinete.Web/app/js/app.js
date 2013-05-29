'use strict';


// Declare app level module which depends on filters, and services
window.app = angular.module('marinet', ['marinetFilters',
    'ngSanitize',
    'marinet.services',
    'marinet.directives',
    'infinite-scroll']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/apps',
            {
                templateUrl: 'partials/apps.html',
                controller: 'AppsController',
                resolve: {
                    apps: function(MultiAccountLoader) {
                        return MultiAccountLoader();
                    }
                }
            });
        $routeProvider.when('/:appName/errors', { templateUrl: 'partials/errors.html', controller: 'ErrorsController' });
        $routeProvider.when('/:appName/errors/:id', { templateUrl: 'partials/error.html', controller: 'ErrorController' });
        $routeProvider.otherwise({ redirectTo: '/apps' });
    }]);
