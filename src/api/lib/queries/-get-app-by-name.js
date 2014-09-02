'use strict';

module.exports = function (promise, Q) {

    return {
        'execute': function (appName) {
            let defered = Q.defer();
            promise.then(function (db) {
                db.get(appName, function (err, body) {
                    if (err) {
                        defered.reject(err);
                    }

                    if (body)
                        defered.resolve(body);

                    defered.reject({
                        status_code: 404,
                        message: 'Not found'
                    });
                });
            });

            return defered.promise;
        }
    }
}
