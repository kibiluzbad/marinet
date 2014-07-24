'use strict';

const
    Q = require('q'),
    shortId = require('shortid'),
    crypto = require('crypto');

function account(app, promise, config) {
    app.get('/api/account/apps', function (req, res) {
        //TODO: Get account id from logged in user!
        promise.then(function (db) {
            db.get(config.account.defaultId, function (err, body) {
                if (err) {
                    res.json(err.status_code, err.message);
                } else {
                    res.json(body.apps);
                }
            });
        });
    });

    app.put('/api/account/app', function (req, res) {
        Q.nfcall(db.get, config.account.defaultId).then(function (args) {
            let account = args[0],
                err = args[1],
                app = req.body;

            //TODO: Create a module to handle app creation

            app.id = shortId.generate();
            app.key = crypto.createHash('sha256').update(app.id).digest("hex");

            account.apps.push(app);

            return db.insert(account, account._id);
        }).then(function (args) {
            let account = args[0],
                err = args[1];
            if (!err) res.json(200, account.apps[account.apps.length - 1]);
        }).catch(function (err) {
            console.log(err);
            res.json(502, {
                error: "bad_gateway",
                reason: err.message
            });
        });
        promise.then(function (db) {
            db.get(config.account.defaultId, function (err, body) {
                if (err) {
                    res.json(err.status_code, err.message);
                } else {
                    res.json(body.apps);
                }
            });
        });
    });
}

module.exports = account;