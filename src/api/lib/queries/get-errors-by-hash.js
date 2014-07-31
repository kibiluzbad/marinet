'use strict';

module.exports = function (promise, Q) {
    return {
        'execute': function (appName, hash) {
            let defered = Q.defer();
            promise.then(function (db) {
                db.view('marinet', 'unique_errors', {
                        key: [appName, hash],
                        group: true
                    },
                    function (err, body) {
                        if (err) {
                            defered.reject(err);
                        }

                        if (body && body.rows && body.rows[0]) {
                            db.get(body.rows[0].value.id, function (err2, body2) {
                                if (err2) {
                                    defered.reject(err2);
                                } else {
                                    body2.keys = body.rows[0].value.keys;
                                    body2.selected = body.rows[0].value.id;
                                    defered.resolve(body2);
                                };
                            });
                        } else
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