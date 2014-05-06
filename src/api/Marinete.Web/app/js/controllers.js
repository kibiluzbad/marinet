'use strict';

/* Controllers */

angular.module('marinet').controller("MessageController", ['$scope', function ($scope) {
    $scope.message = '';
    $scope.$root.$on('message', function (event, args) {
        console.log(args);
        //TODO: Alterar mensagem
        //$scope.message = args;
        alert(args);
    });
}]);

angular.module('marinet').controller('MainController', ['$scope',
    'MultiAccountLoader',
    function ($scope, MultiAccountLoader) {
        $scope.apps = MultiAccountLoader();
        $scope.showNewApp = false;

        $scope.$on('reload', function () {
            $scope.apps = MultiAccountLoader();
            $scope.showNewApp = false;
        });
        
        $scope.newApp = function() {
            $scope.showNewApp = true;
        };
    }]);

angular.module('marinet').controller('AppsController', ['$scope',
    '$exceptionHandler',
    '$http',
    function ($scope, $exceptionHandler, apps, $http) {
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

angular.module('marinet').controller('ErrorsController', ['$scope',
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
    }]);

angular.module('marinet').controller('ErrorController', ['$scope',
    '$routeParams',
    '$http',
    function($scope, $routeParams, $http) {

        $scope.name = $routeParams.appName;
        $scope.slug = $routeParams.slug;

        var urlError = "/error/" + $scope.slug + '?r=' + Math.random() * 99999;
        
        $http.get(urlError)
             .success(function(data, status, headers, config) {
                if (200 == status) {
                    $scope.error = data;
                }
            });

        $scope.solve = function () {
            $http.put(urlError);
        };
    }]);

angular.module('marinet').controller('NewAppController', ['$scope',
    'Account',
    function($scope, Account) {

        $scope.appName = "";
        $scope.saveApp = function () {
            Account.createApp({ "Name": $scope.appName },function() {
                $scope.$root.$emit('message', 'Aplicação criada com sucesso');
                $scope.appName = "";
                $scope.$emit('reload');
            }, function () {
                $scope.$root.$emit('message', 'Erro ao criar a aplicação');
            });
        };
    }]);