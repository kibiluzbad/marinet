'use strict';

angular
    .module('marinetApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'angularMoment',
    'infinite-scroll',
  ])
    .config(['$routeProvider', '$httpProvider',
        function ($routeProvider, $httpProvider) {
            var access = routingConfig.accessLevels;

            $httpProvider.defaults.withCredentials = true;

            $httpProvider.interceptors.push(function ($q, $location) {
                return {
                    'response': function (response) {
                        $('.btn').button('reset');
                        return response || $q.when(response);
                    },

                    'responseError': function (rejection) {
                        if (403 === response.status) window.location = "/login";
                        $('.btn').button('reset');
                        return $q.reject(rejection);
                    }
                };
            });

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
                .when('/:appName/errors/:hash', {
                    templateUrl: 'views/error.html',
                    controller: 'ErrorCtrl',
                    access: access.user
                })
                .when('/login', {
                    templateUrl: 'views/login.html',
                    controller: 'LoginCtrl',
                    access: access.anon
                })
                .when('/logout', {
                    controller: 'LogoutCtrl',
                    access: access.anon
                })
                .otherwise({
                    redirectTo: '/login'
                });
    }])
    .run(['$rootScope', '$location', 'Auth',
        function ($rootScope, $location, Auth) {

            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                if (!Auth.authorize(next.access)) {
                    if (Auth.isLoggedIn()) $location.path('/');
                    else $location.path('/login');
                }
            });

}]);
