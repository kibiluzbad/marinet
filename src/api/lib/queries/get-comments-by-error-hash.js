'use strict';

module.exports = function (promise, Q) {
    return {
        'execute': function (hash) {
            let defered = Q.defer();
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

                        let comments = [];
                        body.rows.forEach(function (item) {
                            comments.push(item.doc)
                        });

                        defered.resolve(comments);
                    });
            });

            return defered.promise;
        }
    }
}