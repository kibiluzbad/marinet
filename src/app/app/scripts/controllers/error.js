'use strict';

angular.module('marinetApp')
    .controller('ErrorCtrl', ['$scope', '$routeParams', 'Errors', 'toaster', '$filter',
        function ($scope, $routeParams, Errors, toaster, $filter) {

            $scope.name = $routeParams.appName;
            $scope.hash = $routeParams.hash;

            $scope.error = Errors.get($scope.hash, $scope.name, function (error) {
                $scope.solved = error.solved;
            });


            $scope.solve = function () {
                toaster.pop('success', '', 'Erro solucionado');
                Errors.solve($scope.hash, $scope.name).then(function (data) {
                    $scope.solved = true;
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
            };

            $scope.canShow = function (key) {
                var blackList = ['message', 'exception', 'keys', 'hash', 'selected', 'solved', 'appName', 'accountId']
                return (-1 === blackList.indexOf(key) && key.indexOf('_') !== 0);
            };

            $scope.displayVal = function (val) {
                if (isDate(val))
                    return $filter('date')(new Date(val), 'MMMM, dd yyyy HH:mm:ss');

                return val;
            };

            function isDate(val) {
                var d = new Date(val);

                if (Object.prototype.toString.call(d) === "[object Date]")
                    if (!isNaN(d.getTime()))
                        if (typeof (val) !== 'number')
                            return true;

                return false;
            }
    }]);
