'use strict';

angular.module('marinetApp')
    .controller('NewappCtrl', ['$scope', 'Apps', 'toaster',
        function ($scope, Apps, toaster) {
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
                        toaster.pop('success', '', 'Aplicação criada com sucesso');
                        $scope.$root.$emit('newapp-created', '');
                        $scope.appName = "";
                        $scope.$root.apps.push(obj);
                        $scope.show = false;
                    }, function (err) {
                        console.log(err);
                        toaster.pop('error', '', 'Erro ao criar a aplicação');
                    });
            };
    }]);
