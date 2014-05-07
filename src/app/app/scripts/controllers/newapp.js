'use strict';

angular.module('marinetApp')
  .controller('NewappCtrl', function ($scope, Apps) {
      $scope.appName = "";
        $scope.saveApp = function () {
            Apps.save({ "Name": $scope.appName })
            .then(function(obj) {
                $scope.$root.$emit('message', 'Aplicação criada com sucesso');
                $scope.appName = "";
                $scope.$root.apps.push(obj);
                $scope.$root.$emit('reload');
            },function () {
                $scope.$root.$emit('message', 'Erro ao criar a aplicação');
            });
        };
  });
