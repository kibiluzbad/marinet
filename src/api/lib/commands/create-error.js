'use strict';

const
    crypto = require('crypto');

module.exports = function (promise, Q) {

    return {
        'execute': function (error, appName) {
            let defered = Q.defer();
            let hash = crypto.createHash('md5').update(JSON.stringify(error.message + error.exception + error.appName)).digest("hex");

            promise.then(function (db) {
                error.appName = appName;
                error.solved = false;
                error.type = 'error';
                db.get(hash, function (err, body) {
                    if (err && err.status_code === 404) {
                        body = error;
                        body.keys = [];
                        body.count = 0;
                    } else if (err && err.status_code !== 404)
                        defered.reject(err);
                    if (body)
                        db.insert(error, function (err2, body2) {
                            if (err2) {
                                defered.reject(err2);
                            } else {
                                body.keys.push(body2.id);
                                body.count++;
                                body.type = 'grouped_error';
                                db.insert(body, hash, function (err3, body3) {
                                    if (err3) {
                                        defered.reject(err3);
                                    } else
                                        defered.resolve(body2);
                                });
                            }
                        });


                });

            });

            return defered.promise;
        }
    }
}
