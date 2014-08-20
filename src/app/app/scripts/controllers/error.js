'use strict';

angular.module('marinetApp')
    .controller('ErrorCtrl', ['$scope', '$routeParams', 'Errors', 'toaster',
        function ($scope, $routeParams, Errors, toaster) {

            $scope.name = $routeParams.appName;
            $scope.hash = $routeParams.hash;

            $scope.error = Errors.get($scope.hash, $scope.name);
            $scope.solve = $scope.error.solve;

            $scope.solve = function () {
                toaster.pop('success', '', 'Erro solucionado');
                Errors.solve($scope.hash, $scope.name).then(function (data) {
                    $scope.solve = true;
                });
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
    }]);
