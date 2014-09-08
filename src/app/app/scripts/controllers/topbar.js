'use strict';

angular.module('marinetApp')
    .controller('TopbarCtrl', ['$scope', '$location', 'Auth', 'toaster',

        function ($scope, $location, Auth, toaster) {
            $scope.showNewApp = false;

            $scope.logout = function () {
                Auth.logout(function () {
                    $location.path('/login');
                }, function (err) {
                    console.log(err);
                    toaster.pop('error', '', 'Falha ao efetuar logout.');
                });
            };

  }]);
