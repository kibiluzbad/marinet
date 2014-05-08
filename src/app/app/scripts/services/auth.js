'use strict';

angular.module('marinetApp')
  .factory('Auth', function($http, $rootScope, $cookieStore){

     var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles
        , currentUser = { username: '', role: userRoles.public };
    
    $rootScope.loggedIn = false;
    $rootScope.user = currentUser;
    $rootScope.accessLevels = accessLevels;
    $rootScope.userRoles = userRoles;

    return {
        authorize: function(accessLevel, role) {
            if(role === undefined)
                role = $rootScope.user.role;
            return accessLevel & role;
        },

        isLoggedIn: function(user) {
            if(user === undefined)
                user = $rootScope.user;
            return user.role === userRoles.user || user.role === userRoles.admin;
        },

        register: function(user, success, error) {
            $http.post(routingConfig.apiUrl+'/register', user).success(success).error(error);
        },

        login: function(user, success, error) {
            $http.post(routingConfig.apiUrl+'/login', user).success(function(data){
                console.log(data);
                $rootScope.user = data;
                $rootScope.loggedIn = true;
                success(data);
            })
            .error(error);
        },

        logout: function(success, error) {
            $http.delete(routingConfig.apiUrl+'/logout').success(function(){
                $rootScope.user = {
                    username: '',
                    role: userRoles.public
                };
                $rootScope.loggedIn = false;
                success();
            }).error(error);
        },

        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    };
});