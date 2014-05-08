'use strict';

angular.module('marinetApp')
  .controller('MessageCtrl', function ($scope) {
    $scope.message = '';
    $scope.show = false;
    $scope.$root.$on('hidemessage',function(event,args){
        $scope.show = false;
        $scope.message = '';
    });
    $scope.$root.$on('message', function (event, args) {
        $scope.show = true;
        $scope.message = args;        
    });
  });
