'use strict';

angular.module('marinetApp')
    .controller('TopbarCtrl', ['$scope', '$location', 'Auth',
        function ($scope, $location, Auth) {
            $scope.showNewApp = false;


            $scope.newApp = function () {
                $scope.$root.$emit('newapp', '');
            };

            $scope.logout = function () {
                Auth.logout(function () {
                    $location.path('/login');
                }, function (err) {
                    console.log(err);
                    toaster.pop('error', '', 'Falha ao efetuar logout.');
                });
            };

  }]);
