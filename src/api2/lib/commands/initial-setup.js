'use strict';

module.exports = function (promise, Q) {
    let defered = Q.defer();

    return {
        'execute': function (id) {
            promise.then(function (db) {
                db.get(id, function (err, body) {
                    if (err && err.status_code === 404) {
                        //TODO: Include admin user
                        let account = {
                            'users': [],
                            'apps': [{
                                'name': 'marinet',
                                'key': 'ac0c0afe317621c1dfae6645bcf7d855b9ecf40f1162952ee3676edbba79f80b',
                                'id': 'ask0DsWqyU6wb5-ggvyZvA'
                            }]
                        };

                        db.insert(account, id, function (err2, body2) {
                            if (err2) {
                                defered.reject(err2);
                            } else {
                                defered.resolve(body2);
                            }
                        })
                    } else if (err) {
                        defered.reject(err);
                    }

                    defered.resolve(body);
                });
            });
            return defered.promise;
        }
    }
}