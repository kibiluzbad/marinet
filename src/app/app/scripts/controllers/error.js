'use strict';

angular.module('marinetApp')
  .controller('ErrorCtrl', function($scope, $routeParams, $http) {

        $scope.name = $routeParams.appName;
        $scope.slug = $routeParams.slug;
        $scope.error = {Message: 'Error message 1'}

        var urlError = "/error/" + $scope.slug + '?r=' + Math.random() * 99999;
        
        $http.get(urlError)
             .success(function(data, status, headers, config) {
                if (200 == status) {
                    $scope.error = data;
                }
            });

        $scope.solve = function () {
            $http.put(urlError);
        };
    });
