(function (exports) {
    'use strict';

    var userRoles = {
        public: 1, // 001
        user: 2, // 010
        admin: 4 // 100
    };

    var userRolesDisplayName = {
        '1': 'public', // 001
        '2': 'user', // 010
        '4': 'admin' // 100
    };

    exports.userRoles = userRoles;
    exports.accessLevels = {
        public: userRoles.public | // 111
        userRoles.user |
            userRoles.admin,
        anon: userRoles.public, // 001
        user: userRoles.user | // 110
        userRoles.admin,
        admin: userRoles.admin // 100
    };
    exports.apiUrl = 'http://localhost:3000';
    exports.roleDisplayName = function (id) {
        return userRolesDisplayName[id];
    }

})(typeof exports === 'undefined' ? this['routingConfig'] = {} : exports);
