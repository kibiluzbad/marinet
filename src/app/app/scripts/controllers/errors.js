'use strict';

angular.module('marinetApp')
    .controller('ErrorsCtrl', ['$scope', '$routeParams', 'Errors',
        function ($scope, $routeParams, Errors) {
            $scope.errors = [];
            $scope.busy = false;
            $scope.page = 1;
            $scope.canLoad = true;
            $scope.name = $routeParams.appName;
            $scope.query = '';

            $scope.search = function () {
                $scope.errors = [];
                $scope.page = 1;
                $scope.canLoad = true;
                $scope.nextPage();
            };

            $scope.setQuery = function (query) {
                $scope.query = query;
                $scope.search();
            };

            $scope.default = function () {
                $scope.solved = null;
                $scope.query = null;
                $scope.sort = null;
                $scope.search();
            }

            $scope.orderAsc = function () {
                $scope.sort = 'asc';
                $scope.search();
            }

            $scope.onlySolved = function () {
                $scope.solved = true;
                $scope.search();
            }

            $scope.nextPage = function () {
                if ($scope.busy || !$scope.canLoad) return;
                $scope.busy = true;

                Errors.query({
                    appName: $scope.name,
                    page: $scope.page,
                    query: $scope.query,
                    solved: $scope.solved,
                    sort: $scope.sort
                }, function (data, status, headers, config) {

                    var items = data.data;
                    for (var i = 0; i < items.length; i++) {
                        $scope.errors.push(items[i]);
                    }

                    var pageInfo = data;
                    var next = parseInt(pageInfo.currentPage) + 1;
                    $scope.sugestions = pageInfo.sugestions;
                    $scope.canLoad = pageInfo.totalPages >= next;
                    $scope.page = pageInfo.totalPages > next ? next : pageInfo.totalPages;
                    $scope.total = pageInfo.totalSize;
                    $scope.busy = false;
                });
            };
            $scope.nextPage();
    }]);
