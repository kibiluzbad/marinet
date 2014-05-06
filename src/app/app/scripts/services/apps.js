'use strict';

angular.module('marinetApp')
  .service('Apps', function Apps($resource) {
        var d = new Date();
        var apps = $resource('http://localhost:6262/Account/Apps',
                             {cacheSlayer: d.getTime()},
                             {
                                purge: {method: 'DELETE', url: 'http://localhost:6262/Account/:appName/Purge'},
                                save: {method: 'POST', url: 'http://localhost:6262/Account/App'} 
                             }); 
        return {
                find: function(){
                    return apps.query();
                },
                save: function(obj){
                    return apps.save(obj).$promise;
                },
                purge: function(appName){
                    apps.purge(appName).$promise;
                }
               };
  });