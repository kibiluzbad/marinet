'use strict';

function application(app, promise, config) {
    app.get('/setup', function (req, res) {
        promise.then(function (db) {
            db.get(config.account.defaultId, function (err, body) {
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
                    console.log(account);
                    db.insert(account, config.account.defaultId, function (err, body) {
                        if (err) {
                            res.json(err.status_code, err.message);
                        } else {
                            res.json(200, 'Setup done');
                        }
                    })
                } else if (err) {
                    res.json(err.status_code, err.message);
                } else {
                    res.json(200, 'Setup done');
                }
            });
        }).done();
    });
}

module.exports = application;