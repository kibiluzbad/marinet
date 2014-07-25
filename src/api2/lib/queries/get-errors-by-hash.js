'use strict';

module.exports = function (promise, Q) {
    let defered = Q.defer();

    return {
        'execute': function (appName, hash) {
            promise.then(function (db) {
                db.view('marinet', 'by_appName', {
                        key: appName + '_' + hash
                    },
                    function (err, body) {
                        if (err) {
                            defered.reject(err);
                        }

                        if (body && body.rows && body.rows[0])
                            defered.resolve(body.rows[0].value);

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