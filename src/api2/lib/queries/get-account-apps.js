'use strict';

module.exports = function (promise, Q) {
    let defered = Q.defer();

    return {
        'execute': function (accountId) {
            promise.then(function (db) {
                db.get(accountId, function (err, body) {
                    if (err) {
                        defered.reject(err);
                    } else {
                        defered.resolve(body);
                    }
                });
            });
            return defered.promise;
        }
    }
}