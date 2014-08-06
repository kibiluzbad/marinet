'use strict';

module.exports = function (promise, Q) {

    return {
        'execute': function (hash) {
            let defered = Q.defer();

            promise.then(function (db) {

                db.get(hash, function (err, body) {
                    if (err) {
                        defered.reject(err);
                    } else {

                        body.solved = true;

                        db.insert(body, hash, function (err2, body2) {
                            if (err2) {
                                defered.reject(err2);
                            } else
                                defered.resolve(body);
                        });
                    }
                });
            });

            return defered.promise;
        }
    }
}
