'use strict';

module.exports = function (promise, Q) {
    return {
        'execute': function (appName, hash) {
            let defered = Q.defer();
            promise.then(function (db) {
                db.get(hash, function (err, body) {
                    if (err) {
                        defered.reject(err);
                    } else {
                        body.selected = body.keys[0];
                        defered.resolve(body);
                    }
                });
            });

            return defered.promise;
        }
    }
}
