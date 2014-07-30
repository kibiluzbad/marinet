'use strict';

angular.module('marinetApp')
    .controller('NewappCtrl', function ($scope, Apps) {
        $scope.appName = "";
        $scope.show = false;

        $scope.$root.$on('newapp', function () {
            $scope.show = true;
        });

        $scope.saveApp = function () {
            Apps.save({
                "name": $scope.appName
            })
                .then(function (obj) {
                    $scope.$root.$emit('message', 'Aplicação criada com sucesso');
                    $scope.$root.$emit('newapp-created', '');
                    $scope.appName = "";
                    $scope.$root.apps.push(obj);
                    $scope.show = false;
                }, function () {
                    $scope.$root.$emit('message', 'Erro ao criar a aplicação');
                });
        };
    });