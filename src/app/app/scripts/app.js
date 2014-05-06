'use strict';

angular
  .module('marinetApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider      
      .when('/apps', {
        templateUrl: 'views/apps.html',
        controller: 'AppsCtrl'
      })
      .when('/:appName/errors', {
        templateUrl: 'views/errors.html',
        controller: 'ErrorsCtrl'
      })
      .when('/:appName/errors/:slug', {
        templateUrl: 'views/error.html',
        controller: 'ErrorCtrl'
      })
      .otherwise({
        redirectTo: '/apps'
      });
  });
