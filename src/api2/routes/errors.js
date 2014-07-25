'use strict';

function errors(app, queries, commands) {
    app.get('/api/:appName/errors', function (req, res) {
        queries.errorsByAppName
            .execute(req.params.appName)
            .then(function (errors) {
                res.json(errors);
            }).catch(function (err) {
                res.json(502, {
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });

    app.post('/api/error', function (req, res) {
        let error = req.body;
        console.log(req.headers._marinetappid);
        console.log(req.headers._marinetappkey);

        queries.getAppName.execute(req.headers._marinetappid, req.headers._marinetappkey)
            .then(function (appName) {
                return commands.createError.execute(error, appName)
                    .then(function (error) {
                        res.json(error)
                    });
            })
            .catch(function (err) {
                res.json(502, {
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });

    app.get('/api/:appName/errors/:hash', function (req, res) {
        queries.getErrorsByHash
            .execute(req.params.appName, req.params.hash)
            .then(function (error) {
                res.json(error);
            }).catch(function (err) {
                res.json(502, {
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });

    app.put('/api/:appName/errors/:hash', function (req, res) {
        queries.getAppByName
            .execute(req.params.appName)
            .then(function (app) {
                return commands.solveErrorsByHash(app, req.params.hash)
                    .then(function (result) {
                        res.json(200, 'Solved');
                    });
            }).catch(function (err) {
                res.json(502, {
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });
}

module.exports = errors;