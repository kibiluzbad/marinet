'use strict';

const Q = require('q'),
    crypto = require('crypto');

function errors(app, promise) {
    app.get('/api/:appName/errors', function (req, res) {
        promise.then(function (db) {
            db.view('marinet', 'by_appName', {
                'key': req.params.appName
            }, function (err, body) {
                if (err) throw err;
                let apps = [];
                body.rows.forEach(function (doc) {
                    apps.push(doc.value);
                });
                res.json(apps);
            });
        }).catch(function (err) {
            console.log(err);
            res.json(502, {
                error: "bad_gateway",
                reason: err.message
            });
        });
    });

    app.post('/api/error', function (req, res) {

        let error = req.body;
        error.hash = crypto.createHash('md5').update(JSON.stringify(error)).digest("hex");

        console.log(error);

        promise.then(function (db) {
            //TODO: Check for Api Key and App Id in the header, to get the app name from couchdb
            let appName = 'marinet';
            Q.nfcall(db.get, appName)
                .then(function (args) {
                    let app = args[0];

                    app.errors.push(req.body);

                    db.insert(app, appName, function (err, body) {
                        if (err) {
                            console.log(err);
                            res.json(err.status_code, {
                                'error': err.message,
                                'reason': err.message
                            });
                        } else
                            res.json(body);
                    });
                }).catch(function (err) {
                    if (err.status_code === 404) {
                        db.insert({
                            errors: [req.body]
                        }, appName, function (err, body) {
                            if (err) {
                                console.log(err);
                                res.json(err.status_code, {
                                    'error': err.message,
                                    'reason': err.message
                                });
                            } else
                                res.json(body);
                        });
                    } else {
                        res.json(502, {
                            error: "bad_gateway",
                            reason: err.message
                        });
                    }
                });
        });
    });
}

module.exports = errors;