'use strict';

angular.module('marinetApp')
    .controller('ErrorCtrl', function ($scope, $routeParams, Errors) {

        $scope.name = $routeParams.appName;
        $scope.hash = $routeParams.hash;

        $scope.error = Errors.get($scope.hash, $scope.name);

        $scope.solve = function () {
            Errors.solve($scope.hash, $scope.name);
        };

        $scope.load = function (id) {
            Errors.getById($scope.hash, id, function (result) {
                result.keys = $scope.error.keys;
                result.selected = id;
                $scope.error = result;
            }, function (err) {
                console.log(err);
            });
        }
    });