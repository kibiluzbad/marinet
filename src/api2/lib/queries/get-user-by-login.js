'use strict';

module.exports = function (promise, Q) {
    let defered = Q.defer();

    return {
        'execute': function (login) {
            promise.then(function (db) {
                db.view('marinet', 'user_by_login', {
                        key: login
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