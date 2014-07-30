'use strict';

module.exports = function (promise, Q) {
    return {
        'execute': function (accountId) {
            let defered = Q.defer();
            promise.then(function (db) {
                db.get(accountId, function (err, body) {
                    if (err) {
                        defered.reject(err);
                    } else {
                        defered.resolve(body.apps);
                    }
                });
            });
            return defered.promise;
        }
    }
}