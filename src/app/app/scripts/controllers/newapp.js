'use strict';

angular.module('marinetApp')
    .controller('NewappCtrl', ['$scope', '$location', 'Apps', 'toaster',
        function ($scope, $location, Apps, toaster) {
            $scope.appName = "";

            $scope.saveApp = function () {
                Apps.save({
                    "name": $scope.appName
                })
                    .then(function (obj) {
                        $scope.$root.apps.push(obj);
                        $location.path($scope.$root.user.accountName + '/dashboard');
                        toaster.pop('success', '', 'Aplicação criada com sucesso');

                    }, function (err) {
                        console.log(err);
                        toaster.pop('error', '', 'Erro ao criar a aplicação');
                    });
            };
    }]);
