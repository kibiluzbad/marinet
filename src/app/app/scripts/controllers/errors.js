'use strict';

angular.module('marinetApp')
  .controller('ErrorsCtrl', function ($scope, $routeParams, $http) {
        $scope.errors = [{Solved:true, Slug: 'error1_message', Message:'Erro1 message', Exception: 'Stack trace', CreatedAt: '01/01/2014', Count: 1}];
        $scope.busy = false;
        $scope.page = 1;
        $scope.canLoad = true;
        $scope.name = $routeParams.appName;        
        $scope.query = "";

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

        $scope.nextPage = function() {
            if ($scope.busy || !$scope.canLoad) return;
            $scope.busy = true;

            var urlErrors = "/errors/" + $scope.name + "?page=" + $scope.page + '&r=' + Math.random() * 99999;
            if ($scope.query) urlErrors += "&query=" + $scope.query;

            $http.get(urlErrors)
                .success(function(data, status, headers, config) {
                    if (200 == status) {
                        var items = data.Data;
                        for (var i = 0; i < items.length; i++) {
                            $scope.errors.push(items[i]);
                        }
                    }
                    var pageInfo = data;
                    var next = pageInfo.CurrentPage + 1;
                    $scope.sugestions = pageInfo.Sugestions;
                    $scope.canLoad = pageInfo.TotalPages >= next;
                    $scope.page = pageInfo.TotalPages > next ? next : pageInfo.TotalPages;
                    $scope.total = pageInfo.TotalSize;
                    $scope.busy = false;
                });
        };
    });
