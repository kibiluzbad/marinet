'use strict';

angular.module('marinetApp')
  .controller('LoginCtrl', function ($scope, $location, Auth) {
      $scope.user = {username:'', password:''};
      $scope.login = function(){
            Auth.login($scope.user, function(){
                $location.path('/apps');
          }, function(){
                $scope.$root.$emit('message', 'Usuário e/ou senha inválido.');
          });
        };
  });
