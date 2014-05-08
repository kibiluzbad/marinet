'use strict';

angular.module('marinetApp')
  .controller('ErrorCtrl', function($scope, $routeParams, Errors) {

        $scope.name = $routeParams.appName;
        $scope.slug = $routeParams.slug;
        
        $scope.error = Errors.get($scope.slug);

        $scope.solve = function () {
            Errors.solve($scope.slug);
        };
    });
