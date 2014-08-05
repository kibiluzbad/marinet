'use strict';

module.exports = function (promise, Q) {
    return {
        'execute': function (appName, page) {
            let defered = Q.defer();
            promise.then(function (db) {
                db.view('marinet', 'unique_errors', {
                        key: appName,
                        include_docs: true,
                        limit: 25,
                        skip: 25 * (page - 1)
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
                            currentPage: page,
                            sugestions: [],
                            totalPages: Math.ceil(body.total_rows / 25),
                            totalSize: body.total_rows,
                            data: errors
                        });

                    });
            });

            return defered.promise;
        }
    }
}
