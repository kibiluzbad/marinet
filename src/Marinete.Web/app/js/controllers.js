'use strict';

/* Controllers */

window.app.controller("MessageController", ['$scope', function ($scope) {
    $scope.message = '';
    $scope.$root.$on('message', function (event, args) {
        console.log(args);
        //TODO: Alterar mensagem
        //$scope.message = args;
        alert(args);
    });
}]);

window.app.controller('MenuController', ['$scope',
     function ($scope) {
         //TODO: Descobrir como eu uso o service aqui!
    }]);

window.app.controller('AppsController', ['$scope',
    '$exceptionHandler',
    'apps',
    '$http',
    function ($scope, $exceptionHandler, apps, $http) {
        $scope.apps = apps;
        $scope.$parent.menu = apps;
        
        $scope.purge = function (appName) {
            $scope.$root.$emit('message', 'Teste');
            if (!confirm("Deseja realmente excluir todos os erros da app '" + appName + "'?")) return;
            
            $http.post("/account/" + appName + "/purge")
                .success(function () {
                    alert("Todos os erros da app '" + appName + "' foram excluidos!");
                })
                .error(function () {
                    alert("Não foi possivel excluir os erros da app '" + appName + "'!");
                });
        };
    } ]);

window.app.controller('ErrorsController', ['$scope',
    '$routeParams',
    '$http',
    function ($scope, $routeParams, $http) {
        $scope.errors = [];
        $scope.busy = false;
        $scope.page = 1;
        $scope.canLoad = true;
        $scope.name = $routeParams.appName;
        $scope.key = $routeParams.appKey;
        $scope.query = "";

        $scope.$watch('query', function(key) {

            $scope.errors = [];
            $scope.page = 1;
            $scope.canLoad = true;
            $scope.nextPage();
        });

        $scope.nextPage = function() {
            if ($scope.busy || !$scope.canLoad) return;
            $scope.busy = true;

            var urlErrors = "/errors/" + $scope.name + "?page=" + $scope.page + '&r=' + Math.random() * 99999;
            if ($scope.query) urlErrors += "&query=" + $scope.query;

            $http.get(urlErrors).
                success(function(data, status, headers, config) {
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
                    $scope.total = pageInfo.TotalSize;
                    $scope.busy = false;
                });
        };
    }]);

window.app.controller('ErrorController', ['$scope',
    '$routeParams',
    '$http',
    function($scope, $routeParams, $http) {

        $scope.name = $routeParams.appName;
        $scope.id = $routeParams.id;


        var urlError = "/error/" + $scope.id + '?r=' + Math.random() * 99999;
        $http.get(urlError).
            success(function(data, status, headers, config) {
                if (200 == status) {
                    $scope.error = data;
                }
            });
    }]);

window.app.controller('NewAppController', ['$scope',
    '$http',
    '$location',
    function($scope, $http, $location) {

        $scope.appName = "";
        $scope.saveApp = function() {
            var url = "/account/app";
            $http.post(url, { "Name": $scope.appName }).success(function(data, status, headers, config) {
                if (200 == status) {
                    $location.path("/");
                }
            });
        };
    }]);