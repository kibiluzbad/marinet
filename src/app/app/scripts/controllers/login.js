'use strict';

angular.module('marinetApp')
    .controller('LoginCtrl', ['$scope', '$location', 'Auth', 'toaster',
        function ($scope, $location, Auth, toaster) {
            $scope.user = {
                username: '',
                password: ''
            };
            $scope.login = function () {
                Auth.login($scope.user, function (user) {
                    $scope.$root.user = user;
                    $location.path(user.accountName + '/dashboard');
                    $scope.$root.$emit('hidemessage', '');
                }, function () {
                    toaster.pop('warning', '', 'Usuário e/ou senha inválido');
                });
            };
  }]);
