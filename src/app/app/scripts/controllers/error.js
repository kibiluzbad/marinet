'use strict';

angular.module('marinetApp')
    .controller('ErrorCtrl', ['$scope', '$routeParams', 'Errors',
        function ($scope, $routeParams, Errors) {

            $scope.name = $routeParams.appName;
            $scope.hash = $routeParams.hash;

            $scope.error = Errors.get($scope.hash, $scope.name);
            $scope.solve = $scope.error.solve;

            $scope.solve = function () {
                $scope.$root.$emit('message', 'Erro solucionado.');
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
