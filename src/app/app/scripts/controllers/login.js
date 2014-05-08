'use strict';

angular.module('marinetApp')
  .controller('LoginCtrl', function ($scope, $location, Auth) {
      $scope.user = {username:'', password:''};
      $scope.login = function(){
            Auth.login($scope.user, function(){
                $scope.$root.user = {username: $scope.user.username, role: routingConfig.userRoles.user}
                $location.path('/apps');
                $scope.$root.$emit('hidemessage','');
          }, function(){
                $scope.$root.$emit('message', 'Usuário e/ou senha inválido.');
          });
        };
  });
