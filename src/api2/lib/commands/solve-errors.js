'use strict';

module.exports = function (promise, Q) {

    return {
        'execute': function (keys) {
            let defered = Q.defer();

            promise.then(function (db) {

                db.fetch({
                    'keys': keys
                }, function (err, body) {
                    if (err) {
                        defered.reject(err);
                    } else {
                        let
                            errors = [];
                        body.rows.forEach(function (item) {
                            item.doc.solved = true;
                            errors.push(item.doc);
                        });

                        db.bulk({
                            'docs': errors
                        }, function (err2, body2) {
                            if (err2) {
                                defered.reject(err2);
                            } else
                                defered.resolve(body2);
                        });
                    }
                });
            });

            return defered.promise;
        }
    }
}