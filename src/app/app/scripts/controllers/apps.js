'use strict';

angular.module('marinetApp')
  .controller('AppsCtrl', function ($scope) {
     $scope.$root.apps = [{Name: 'App1', Key: 'key1'},{Name: 'App2', Key: 'key2'},{Name: 'App3', Key: 'key3'}];
        $scope.showNewApp = false;

        $scope.$on('reload', function () {            
            $scope.showNewApp = false;
        });

        $scope.newApp = function() {
            $scope.showNewApp = true;
        };
      
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
  });
