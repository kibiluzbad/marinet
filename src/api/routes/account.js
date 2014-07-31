'use strict';

function account(app, config, queries, commands, authed, passport) {
    app.get('/api/account/apps', authed, function (req, res) {
        queries.getAccountApps.execute(req.user.accountId)
            .then(function (apps) {
                res.json(apps);
            }).catch(function (err) {
                res.json(502, {
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });

    app.post('/api/account/app', authed, function (req, res) {
        let
            app = req.body,
            accountId = req.user.accountId;

        commands.createApp.execute(accountId, app)
            .then(function (errors) {
                res.json(errors)
            }).catch(function (err) {
                res.json(502, {
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });

    app.post('/api/login',
        passport.authenticate('local'),
        function (req, res) {
            res.json(200, {
                'username': req.user.login,
                'role': req.user.role
            });
        });

    app.get('/api/logout', authed, function (req, res) {
        req.logout();
        res.json(200, 'OK');
    });
}

module.exports = account;