'use strict';

angular.module('marinetApp')
  .controller('AppsCtrl', function ($scope, Apps) {
     $scope.$root.apps = Apps.find();
        $scope.$root.showNewApp = false;

        $scope.$root.$on('reload', function () {            
            $scope.$root.showNewApp = false;
        });

        $scope.$root.newApp = function() {
            $scope.$root.showNewApp = true;
        };
      
        $scope.purge = function (appName) {
            
            if (!confirm('Deseja realmente excluir todos os erros da app \'' + appName + '\'?')) return;
            
            Apps.purge(appName)
                .success(function () {
                    alert('Todos os erros da app \'' + appName + '\' foram excluidos!');
                })
                .error(function () {
                    alert('Não foi possivel excluir os erros da app \'' + appName + '\'!');
                });
        };
  });
