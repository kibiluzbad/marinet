'use strict';

module.exports = function (promise, Q) {
    let defered = Q.defer();

    return {
        'execute': function (appName) {
            promise.then(function (db) {
                db.view('marinet', 'unique_errors', {
                        startkey: [appName],
                        endkey: [appName, {}],
                        group: true
                    },
                    function (err, body) {
                        if (err) {
                            defered.reject(err);
                        }
                        if (!body) return;
                        let errors = [],
                            counts = {},
                            ids = []
                        body.rows.forEach(function (item) {
                            counts[item.value.id] = item.value.count;
                            ids.push(item.value.id);
                        });

                        db.fetch({
                            'keys': ids
                        }, function (err2, body2) {
                            if (err2) {
                                defered.reject(err2);
                            }
                            body2.rows.forEach(function (error) {
                                errors.push({
                                    'count': counts[error.id],
                                    'error': error.doc
                                });
                            });

                            defered.resolve(errors);
                        });

                    });
            });

            return defered.promise;
        }
    }
}