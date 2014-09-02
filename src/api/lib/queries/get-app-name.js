'use strict';

module.exports = function (App, Q) {

    return {
        'execute': function (appId, appKey) {
            let defered = Q.defer();

            App.findOne()
                .where('id').equals(appId)
                .where('key').equals(appKey)
                .exec(function (err, app) {
                    if (err) defered.reject(err);
                    if (apps) defered.resolve(app.name);
                });

            return defered.promise;
        }
    }
}
