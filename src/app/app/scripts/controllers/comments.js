'use strict';

/**
 * @ngdoc function
 * @name marinetApp.controller:CommentsCtrl
 * @description
 * # CommentsCtrl
 * Controller of the marinetApp
 */
angular.module('marinetApp')
    .controller('CommentsCtrl', function ($scope, Comments) {
        $scope.comments = Comments.query($scope.hash);
        $scope.lastMessageTime = '';

        $scope.send = function () {

        };
    });