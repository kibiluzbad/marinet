'use strict';

angular.module('marinetApp')
    .controller('LogoutCtrl', ['$scope', '$location', 'Auth',
        function ($scope, $location, Auth) {
            Auth.logout(function () {
                $location.path('/login');
            });
  }]);