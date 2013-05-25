'use strict';


// Declare app level module which depends on filters, and services
angular.module('marinet', ['marinetFilters', 'marinetServices', 'ngSanitize', 'infinite-scroll', 'SharedServices']).
  config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/apps', { templateUrl: 'partials/apps.html', controller: AppsController });
      $routeProvider.when('/:appName/errors', { templateUrl: 'partials/errors.html', controller: ErrorsController });
      $routeProvider.when('/:appName/errors/:id', { templateUrl: 'partials/error.html', controller: ErrorController });
    $routeProvider.otherwise({redirectTo: '/apps'});
  }]);
