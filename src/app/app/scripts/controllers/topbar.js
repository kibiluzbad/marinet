'use strict';

angular.module('marinetApp')
  .controller('TopbarCtrl', function ($scope, $location, Auth) {
     $scope.showNewApp = false;

        $scope.$root.$on('reload', function () {            
            $scope.showNewApp = false;
        });

        $scope.newApp = function() {
            $scope.showNewApp = true;
        };
      
      $scope.logout = function() {
            Auth.logout( function(){
                $location.path('/login');
          }, function(){
                $scope.$root.$emit('message', 'Falha ao efetuar logout.');
          });
        };
      
  });
