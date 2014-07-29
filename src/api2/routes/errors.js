'use strict';

function errors(app, queries, commands, authed) {
    app.get('/api/:appName/errors', authed, function (req, res) {
        queries.getAppErrors
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

    app.get('/api/error/:hash', authed, function (req, res) {
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

    app.get('/api/error/:hash/:id', authed, function (req, res) {
        queries.getErrorsById
            .execute(req.params.id)
            .then(function (error) {
                res.json(error);
            }).catch(function (err) {
                res.json(502, {
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });

    app.put('/api/error/:hash', authed, function (req, res) {
        commands.solveErrors
            .execute(req.body.keys)
            .then(function (result) {
                res.json(200, 'Solved');
            })
            .catch(function (err) {
                res.json(502, {
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });
}

module.exports = errors;