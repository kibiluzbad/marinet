'use strict';

/**
 * @ngdoc service
 * @name marinetApp.Comments
 * @description
 * # Comments
 * Factory in the marinetApp.
 */
angular.module('marinetApp')
    .factory('Comments', ['$resource',
        function ($resource) {
            var d = new Date();
            var comments = $resource(routingConfig.apiUrl + '/comments/:hash', {
                cacheSlayer: d.getTime()
            }, {
                'comment': {
                    method: 'POST',
                    url: routingConfig.apiUrl + '/comment'
                }
            });
            return {
                query: function (hash) {
                    return comments.query({
                        hash: hash
                    });
                },
                comment: function (data) {
                    return comments.comment(data).$promise;
                }
            };
    }]);