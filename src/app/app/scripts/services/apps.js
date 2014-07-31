'use strict';

angular.module('marinetApp')
    .factory('Apps', ['$resource',
        function ($resource) {
            var d = new Date();
            var apps = $resource(routingConfig.apiUrl + '/account/apps', {
                cacheSlayer: d.getTime()
            }, {
                purge: {
                    method: 'DELETE',
                    url: routingConfig.apiUrl + '/account/:appName/Purge'
                },
                save: {
                    method: 'POST',
                    url: routingConfig.apiUrl + '/account/app'
                }
            });
            return {
                find: function () {
                    return apps.query();
                },
                save: function (obj) {
                    return apps.save(obj).$promise;
                },
                purge: function (appName) {
                    return apps.purge({
                        appName: appName
                    }).$promise;
                }
            };
    }]);