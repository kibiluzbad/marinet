'use strict';

angular.module('marinetApp')
  .factory('Errors', function ($resource) {
    var d = new Date();
        var errors = $resource(routingConfig.apiUrl+'/error/:slug',
                             {cacheSlayer: d.getTime()},
                             {
                                 'find': {url: routingConfig.apiUrl+'/errors/:appName'},
                                 'solve': {method: 'PUT'}
                             }); 
        return {
                query: function(appName, page, query,success,error){
                    return errors.find({appName: appName, page: page, query: query},
                                      success,
                                      error);
                },
                get: function(slug){
                    return errors.get({slug: slug});
                },                
                solve: function(slug){
                    return errors.solve({slug: slug});
                },
        };    
  });
