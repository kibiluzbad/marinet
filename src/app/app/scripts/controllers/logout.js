'use strict';

angular.module('marinetApp')
  .controller('LogoutCtrl', function ($scope, $location, Auth) {
    Auth.logout(function(){
        $location.path('/login');
    });
  });
