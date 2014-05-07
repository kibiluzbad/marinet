'use strict';

angular.module('marinetApp')
  .controller('TopbarCtrl', function ($scope, $location, Auth) {
     $scope.showNewApp = false;

        $scope.$root.$on('reload', function () {            
            $scope.$root.showNewApp = false;
        });

        $scope.newApp = function() {
            $scope.$root.showNewApp = true;
        };
      
      $scope.logout = function() {
            Auth.logout( function(){
                $location.path('/login');
          }, function(){
                $scope.$root.$emit('message', 'Falha ao efetuar logout.');
          });
        };
      
  });
