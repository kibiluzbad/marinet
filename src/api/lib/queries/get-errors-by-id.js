'use strict';

module.exports = function (promise, Q) {

    return {
        'execute': function (id) {
            let defered = Q.defer();
            promise.then(function (db) {
                db.get(id, function (err, body) {
                    if (err) {
                        defered.reject(err);
                    }

                    if (body) {
                        defered.resolve(body);
                    }

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