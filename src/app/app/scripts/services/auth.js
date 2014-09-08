'use strict';

angular.module('marinetApp')
    .service('Auth', ['$http', '$rootScope', '$cookieStore', '$q',
        function ($http, $rootScope, $cookieStore, $q) {

            var accessLevels = routingConfig.accessLevels,
                userRoles = routingConfig.userRoles;

            var deferred = $q.defer();

            $http.get(routingConfig.apiUrl + '/user')
                .success(function (data) {
                    console.log(data);
                    $rootScope.loggedIn = true;
                    deferred.resolve(data);
                })
                .error(function (err) {
                    console.log(err);
                    deferred.resolve({
                        username: '',
                        role: userRoles.public
                    });
                });

            $rootScope.loggedIn = false;
            $rootScope.user = deferred.promise;

            $rootScope.accessLevels = accessLevels;
            $rootScope.userRoles = userRoles;

            return {
                authorize: function (accessLevel, role) {
                    console.log($rootScope.user);
                    if (role === undefined)
                        role = $rootScope.user.role;
                    return accessLevel & role;
                },

                isLoggedIn: function (user) {
                    return $rootScope.user.role === userRoles.user || $rootScope.user.role === userRoles.admin;
                },

                register: function (user, success, error) {
                    $http.post(routingConfig.apiUrl + '/register', user).success(success).error(error);
                },

                login: function (user, success, error) {
                    $http.post(routingConfig.apiUrl + '/login', user).success(function (data) {
                        console.log(data);
                        $rootScope.user = data;
                        $rootScope.loggedIn = true;
                        success(data);
                    })
                        .error(error);
                },

                logout: function (success, error) {
                    $http.delete(routingConfig.apiUrl + '/logout').success(function () {
                        $rootScope.user = {
                            username: '',
                            role: userRoles.public
                        };
                        $rootScope.loggedIn = false;
                        success();
                    }).error(error);
                },

                accessLevels: accessLevels,
                userRoles: userRoles,
                user: $rootScope.user
            };
}]);
