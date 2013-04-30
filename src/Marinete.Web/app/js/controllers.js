'use strict';

/* Controllers */

function AppsController($scope, $http) {
    var url = "/account/apps";

    $http.get(url).
        success(function(data, status, headers, config) {
            if (200 == status)
                $scope.apps = data;
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

    $scope.nextPage = function () {
        if ($scope.busy || !$scope.canLoad) return;
        $scope.busy = true;

        var urlErrors = "/errors/" + $scope.name + "?page=" + $scope.page;
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


    var urlError = "/error/" + $scope.id;
    $http.get(urlError).
        success(function(data, status, headers1, config1) {
            if (200 == status) {
                $scope.error = data;
            }
        });
    }

    function NewAppController($scope, $http) {

        $scope.appName = "";
        $scope.saveApp = function() {
            var url = ""
            $http.post()
        };
    }


