'use strict';

angular.module('marinetApp')
  .factory('Apps', function ($resource) {
       var d = new Date();
        var apps = $resource(routingConfig.apiUrl+'/Account/Apps',
                             {cacheSlayer: d.getTime()},
                             {
                                purge: {method: 'DELETE', url: routingConfig.apiUrl+'/Account/:appName/Purge'},
                                save: {method: 'POST', url: routingConfig.apiUrl+'/Account/App'} 
                             }); 
        return {
                find: function(){
                    return apps.query();
                },
                save: function(obj){
                    return apps.save(obj).$promise;
                },
                purge: function(appName){
                    return apps.purge({appName:appName}).$promise;
                }
        };
  });
