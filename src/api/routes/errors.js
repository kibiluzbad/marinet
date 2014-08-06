'use strict';

function errors(app, queries, commands, authed) {
    app.get('/:appName/errors', authed, function (req, res) {
        queries.searchErrors
            .execute(req.query.q, req.params.appName, req.query.page)
            .then(function (errors) {
                res.json(errors);
            }).catch(function (err) {
                res.json(err);
            });
    });

    app.post('/error', function (req, res) {
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
                res.json(err);
            });
    });

    app.get('/:appName/error/:hash', authed, function (req, res) {

        queries.getErrorsByHash
            .execute(req.params.appName, req.params.hash)
            .then(function (error) {
                res.json(error);
            }).catch(function (err) {
                res.json(err);
            });
    });

    app.get('/error/:hash/:id', authed, function (req, res) {

        queries.getErrorsById
            .execute(req.params.id)
            .then(function (error) {
                res.json(error);
            }).catch(function (err) {
                res.json(err);
            });
    });

    app.put('/error/:hash', authed, function (req, res) {
        commands.solveErrors
            .execute(req.params.hash)
            .then(function (result) {
                res.status(200).json('Solved');
            })
            .catch(function (err) {
                res.json(err);
            });
    });
}

module.exports = errors;
