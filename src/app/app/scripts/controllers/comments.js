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
        $scope.message = '';

        $scope.displayRole = function (role) {
            return routingConfig.roleDisplayName(role);
        };
        $scope.send = function () {
            Comments.comment({
                hash: $scope.hash,
                message: $scope.message
            }).then(function (result) {
                console.log(result);
                $scope.comments.push(result);
                $scope.message = '';
            });
        };
    });