'use strict';

function account(app, config, queries, commands) {
    app.get('/api/account/apps', function (req, res) {
        //TODO: Get account id from logged in user!        
        queries.getAccountApps.execute(config.account.defaultId)
            .then(function (apps) {
                res.json(apps);
            }).catch(function (err) {
                res.json(502, {
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });

    app.put('/api/account/app', function (req, res) {
        let
            app = req.body,
            accountId = config.account.defaultId;
        console.log(app);
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
}

module.exports = account;