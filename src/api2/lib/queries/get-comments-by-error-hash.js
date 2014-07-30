'use strict';

module.exports = function (promise, Q) {
    let defered = Q.defer();

    return {
        'execute': function (hash) {
            promise.then(function (db) {
                db.view('marinet', 'comments_by_error_hash', {
                        startkey: [hash],
                        endkey: [hash, {}],
                        include_docs: true
                    },
                    function (err, body) {
                        if (err) {
                            defered.reject(err);
                        }

                        defered.resolve(body.rows);

                    });
            });

            return defered.promise;
        }
    }
}