'use strict';

function errors(app, queries, commands) {
    app.get('/api/:appName/errors', function (req, res) {
        queries.errorsByAppName
            .execute(req.params.appName)
            .then(function (errors) {
                res.json(errors)
            }).catch(function (err) {
                res.json(502, {
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });

    app.post('/api/error', function (req, res) {

        let error = req.body,
            //TODO: Check for Api Key and App Id in the header, to get the app name from couchdb
            appName = 'test2';
        commands.createError.execute(error, appName)
            .then(function (error) {
                res.json(error)
            }).catch(function (err) {
                res.json(502, {
                    error: "bad_gateway",
                    reason: err.message
                });
            });

    });
}

module.exports = errors;