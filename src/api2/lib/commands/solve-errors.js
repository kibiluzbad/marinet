'use strict';

module.exports = function (promise, Q) {
    let defered = Q.defer();

    return {
        'execute': function (keys) {

            promise.then(function (db) {

                db.fetch({
                    'keys': keys
                }, function (err, body) {
                    if (err) {
                        defered.reject(err);
                    } else {
                        let
                            erros = [];
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