'use strict';

module.exports = function (promise, Q) {
    return {
        'execute': function (appName) {
            let defered = Q.defer();
            promise.then(function (db) {
                db.view('marinet', 'unique_errors', {
                        key: appName,
                        include_docs: true
                    },
                    function (err, body) {
                        if (err) {
                            defered.reject(err);
                        }
                        let errors = [];

                        body.rows.forEach(function (item) {
                            errors.push(item.doc);
                        });

                        defered.resolve({
                            currentPage: 1,
                            sugestions: [],
                            totalPages: 1,
                            totalSize: errors.length,
                            data: errors
                        });

                    });
            });

            return defered.promise;
        }
    }
}
