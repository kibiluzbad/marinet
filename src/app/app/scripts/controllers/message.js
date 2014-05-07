'use strict';

angular.module('marinetApp')
  .controller('MessageCtrl', function ($scope) {
    $scope.message = '';
    $scope.show = false;
    $scope.$root.$on('message', function (event, args) {
        console.log(args);
        $scope.show = true;
        $scope.message = args;        
    });
  });
