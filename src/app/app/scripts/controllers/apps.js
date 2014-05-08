'use strict';

angular.module('marinetApp')
  .controller('AppsCtrl', function ($scope, Apps) {
     $scope.$root.apps = Apps.find();     
     $scope.showNewApp = false;
     $scope.$root.$on('newapp',function(){
       $scope.showNewApp = true;
     });
     $scope.$root.$on('newapp-created',function(){
       $scope.showNewApp = false;
     });
      
        $scope.purge = function (appName) {
            
            if (!confirm('Deseja realmente excluir todos os erros da app \'' + appName + '\'?')) return;
            
            Apps.purge(appName)
                .then(function () {
                    alert('Todos os erros da app \'' + appName + '\' foram excluidos!');
                },function () {
                    alert('Não foi possivel excluir os erros da app \'' + appName + '\'!');
                });
        };
  });
