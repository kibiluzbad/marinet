'use strict';

angular.module('marinetApp')
    .factory('Errors', function ($resource) {
        var d = new Date();
        var errors = $resource(routingConfig.apiUrl + '/error/:hash', {
            cacheSlayer: d.getTime()
        }, {
            'find': {
                url: routingConfig.apiUrl + '/:appName/errors'
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
                        query: query
                    },
                    success,
                    error);
            },
            get: function (hash) {
                return errors.get({
                    hash: hash
                });
            },
            solve: function (hash) {
                return errors.solve({
                    hash: hash
                });
            },
        };
    });