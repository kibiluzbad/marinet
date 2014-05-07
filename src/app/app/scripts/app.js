'use strict';

angular
  .module('marinetApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    var access = routingConfig.accessLevels;
    $routeProvider      
      .when('/apps', {
        templateUrl: 'views/apps.html',
        controller: 'AppsCtrl',
        access: access.user
      })
      .when('/:appName/errors', {
        templateUrl: 'views/errors.html',
        controller: 'ErrorsCtrl',
        access: access.user
      })
      .when('/:appName/errors/:slug', {
        templateUrl: 'views/error.html',
        controller: 'ErrorCtrl',
        access: access.user
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        access: access.anon
      })
      .otherwise({
        redirectTo: '/apps'
      });
  })
.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (!Auth.authorize(next.access)) {
            if(Auth.isLoggedIn()) $location.path('/');
            else                  $location.path('/login');
        }
    });

}]);
