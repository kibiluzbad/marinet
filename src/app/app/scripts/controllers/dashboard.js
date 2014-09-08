'use strict';

/**
 * @ngdoc function
 * @name marinetApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the marinetApp
 */
angular.module('marinetApp')
    .controller('DashboardCtrl', ['$scope', 'Apps',
        function ($scope, Apps) {
            $scope.$root.apps = Apps.find();
  }]);
