'use strict';

angular.module('marinetApp')
    .controller('LoginCtrl', ['$scope', '$location', 'Auth',
        function ($scope, $location, Auth) {
            $scope.user = {
                username: '',
                password: ''
            };
            $scope.login = function () {
                Auth.login($scope.user, function (user) {
                    $scope.$root.user = user;
                    $location.path('/apps');
                    $scope.$root.$emit('hidemessage', '');
                }, function () {
                    $scope.$root.$emit('message', 'Usuário e/ou senha inválido.');
                });
            };
  }]);