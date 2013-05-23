'use strict';

/* Controllers */

function AppsController($scope, $http) {
    var url = "/account/apps" + '?r=' + Math.random() * 99999;
    
    $http.get(url).
        success(function (data, status, headers, config) {
            if (200 == status) {
                if (-1 != data.toString().indexOf("<!DOCTYPE html>")) {
                    location.href = "/";
                } else {
                    $scope.apps = data;
                }
            }
        });

}
//TimesheetController.$inject = ['$scope'];

function ErrorsController($scope, $routeParams, $http) {
    $scope.errors = [];
    $scope.busy = false;
    $scope.page = 1;
    $scope.canLoad = true;
    $scope.name = $routeParams.appName;
    $scope.key = $routeParams.appKey;
    $scope.query = "";

    $scope.$watch('query', function (key) {
        
        $scope.errors = [];
        $scope.page = 1;
        $scope.canLoad = true;
        $scope.nextPage();
    });

    $scope.nextPage = function () {
        if ($scope.busy || !$scope.canLoad) return;
        $scope.busy = true;

        var urlErrors = "/errors/" + $scope.name + "?page=" + $scope.page + '&r=' + Math.random() * 99999;
        if ($scope.query) urlErrors += "&query=" + $scope.query;
        
        $http.get(urlErrors).
            success(function (data, status, headers, config) {
                if (200 == status) {
                    var items = data.Data;
                    for (var i = 0; i < items.length; i++) {
                        $scope.errors.push(items[i]);
                    }
                }
                var pageInfo = data;
                var next = pageInfo.CurrentPage + 1;
                $scope.canLoad = pageInfo.TotalPages >= next;
                $scope.page = pageInfo.TotalPages > next ? next : pageInfo.TotalPages;
                $scope.busy = false;
            });
    };
}

function ErrorController($scope, $routeParams, $http) {

    $scope.name = $routeParams.appName;
    $scope.id = $routeParams.id;


    var urlError = "/error/" + $scope.id + '?r=' + Math.random() * 99999;
    $http.get(urlError).
        success(function(data, status, headers, config) {
            if (200 == status) {
                $scope.error = data;
            }
        });
    }

    function NewAppController($scope, $http, $location) {

        $scope.appName = "";
        $scope.saveApp = function () {
            var url = "/account/app";
            $http.post(url, { "Name": $scope.appName }).success(function (data, status, headers, config) {
                if (200 == status) {
                    $location.path("/");
                }
            });
        };
    }


