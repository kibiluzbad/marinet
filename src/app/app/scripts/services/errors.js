'use strict';

angular.module('marinetApp')
    .factory('Errors', ['$resource',
        function ($resource) {
            var d = new Date();
            console.log('criado');
            var errors = $resource(routingConfig.apiUrl + '/:appName/error/:hash', {
                cacheSlayer: d.getTime()
            }, {
                'find': {
                    url: routingConfig.apiUrl + '/:appName/errors'
                },
                'findOne': {
                    url: routingConfig.apiUrl + '/error/:hash/:id'
                },
                'solve': {
                    method: 'PUT',
                    params: {
                        hash: '@hash'
                    }
                }
            });
            return {
                query: function (appName, page, query, success, error) {
                    return errors.find({
                            appName: appName,
                            page: page,
                            q: query,
                            cacheSlayer: d.getTime()
                        },
                        success,
                        error);
                },
                get: function (hash, appName) {
                    return errors.get({
                        hash: hash,
                        appName: appName
                    });
                },
                getById: function (hash, id, success, error) {
                    return errors.findOne({
                            hash: hash,
                            id: id
                        },
                        success,
                        error);
                },
                solve: function (hash, appName) {
                    return errors.solve({
                        hash: hash,
                        appName: appName
                    }).$promise;
                },
            };
    }]);
