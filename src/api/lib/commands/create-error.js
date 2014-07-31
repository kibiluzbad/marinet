'use strict';

const
    crypto = require('crypto');

module.exports = function (promise, Q) {

    return {
        'execute': function (error, appName) {
            let defered = Q.defer();
            let hash = crypto.createHash('md5').update(JSON.stringify(error.message + error.stackTrace)).digest("hex");

            promise.then(function (db) {

                error.solved = false;
                error.hash = hash;
                error.type = "error";

                db.insert(error, function (err, body) {
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