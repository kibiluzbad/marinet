'use strict';

const
    crypto = require('crypto');

module.exports = function (promise, Q) {
    let defered = Q.defer();

    return {
        'execute': function (error, appName) {
            error.hash = crypto.createHash('md5').update(JSON.stringify(error)).digest("hex");

            promise.then(function (db) {

                db.get(appName, function (err, body) {
                    let app = body;

                    if (err && err.status_code === 404) {
                        app = {
                            errors: []
                        };
                    } else if (err) {
                        defered.reject(err);
                    }

                    app.errors.push(error);

                    db.insert(app, appName, function (err, body) {
                        if (err) {
                            defered.reject(err);
                        } else
                            defered.resolve(body);
                    });
                });
            });
            return defered.promise;
        }
    }
}