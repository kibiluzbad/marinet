'use strict';

/* Controllers */

function AppsController($scope, $http) {
    var url = "http://localhost:5252/api/account/apps?callback=JSON_CALLBACK";

    $http.jsonp(url).
    success(function (data, status, headers, config) {
        if (200 == status)
            $scope.apps = data;
    }).
    error(function (data, status, headers, config) {
       //TODO: Tratar erros.
    });

    
}
//TimesheetController.$inject = ['$scope'];

function ErrorsController($scope, $routeParams, $http, $timeout) {

    var urlToken = "http://localhost:5252/api/account/token?callback=JSON_CALLBACK&appName=" + $routeParams.appName + "&appKey=" + $routeParams.appKey;

    $scope.name = $routeParams.appName;
    $scope.key = $routeParams.appKey;

    var poller = function () {
        $http.jsonp(urlToken).
        success(function (data, status, headers, config) {
            if (200 == status) {
                var urlErrors = "http://localhost:5252/api/errors?callback=JSON_CALLBACK&tokenKey=" + data;
                console.log(urlErrors);
                $http.jsonp(urlErrors).
                    success(function (data1, status1, headers1, config1) {
                        if (200 == status) {
                            console.log(data1);
                            $scope.errors = data1;
                        }
                        $timeout(poller, 1000);
                    });
            }
        });

    };
    poller();
}

function ErrorController($scope, $routeParams, $http, $timeout) {
    var urlToken = "http://localhost:5252/api/account/token?callback=JSON_CALLBACK&appName=" + $routeParams.appName + "&appKey=" + $routeParams.appKey;

    $scope.name = $routeParams.appName;
    $scope.key = $routeParams.appKey;

    var poller = function () {
        $http.jsonp(urlToken).
        success(function (data, status, headers, config) {
            if (200 == status) {
                var urlError = "http://localhost:5252/api/error?callback=JSON_CALLBACK&tokenKey=" + data + "&message=" + $routeParams.message;
                console.log(urlError);
                $http.jsonp(urlError).
                    success(function (data1, status1, headers1, config1) {
                        if (200 == status) {
                            console.log(data1);
                            $scope.errors = data1;
                        }
                        $timeout(poller, 1000);
                    });
            }
        });

    };
    poller();
}


