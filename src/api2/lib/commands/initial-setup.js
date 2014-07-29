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
                            'users': [{
                                'id': '30ebd7f0035613386f788402779039c5',
                                'name': 'Administrator',
                                'login': 'admin',
                                'password': 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86',
                                'role': '4'
                            }],
                            'apps': [{
                                'name': 'marinet',
                                'key': 'ac0c0afe317621c1dfae6645bcf7d855b9ecf40f1162952ee3676edbba79f80b',
                                'id': 'ask0DsWqyU6wb5-ggvyZvA'
                            }],
                            'type': 'account'
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