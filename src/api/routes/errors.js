'use strict';

function errors(app, queries, commands, authed, publisher) {
    app.get('/:appName/errors', authed, function (req, res) {
        queries.searchErrors
            .execute({
                query: req.query.q,
                appName: req.params.appName,
                solved: req.query.solved ? true : false,
                sort: req.query.sort !== 'asc' ? "\\" : "/",
            }, req.query.page)
            .then(function (errors) {
                res.json(errors);
            }).catch(function (err) {
                res.json(err);
            });
    });

    app.post('/error', function (req, res) {
        let error = req.body;

        publisher.send(JSON.stringify({
            type: 'newerror',
            error: error,
            app: {
                id: req.headers._marinetappid,
                key: req.headers._marinetappkey
            },
            date: Date.now()
        }));

        res.json({
            'message': 'queued'
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
