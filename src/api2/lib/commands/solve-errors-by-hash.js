'use strict';

const
    crypto = require('crypto');

module.exports = function (promise, Q) {
    let defered = Q.defer();

    return {
        'execute': function (app, hash) {

            promise.then(function (db) {

                app.errors.forEach(function (error) {
                    if (error.hash === hash) error.solved = true;
                });

                db.insert(app, app._id, function (err, body) {
                    if (err) {
                        defered.reject(err);
                    } else
                        defered.resolve(body);
                });
            });

            return defered.promise;
        }
    }
}