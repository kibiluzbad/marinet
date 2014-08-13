"use strict";

const
    environment = process.env.NODE_ENV || 'development',
    log = require('npmlog'),
    zmq = require('zmq'),
    Q = require('q'),
    config = require('../config/' + environment + '.js'),
    deferedDb = require('../setup/db.js')(config, log),
    getAppName = require('../lib/queries/get-app-name.js')(deferedDb, Q),
    createError = require('../lib/commands/create-error.js')(deferedDb, Q),
    subscriber = zmq.socket('sub');

let
    success = 0,
    error = 0;

subscriber.subscribe("");

subscriber.on("message", function (data) {
    let message = JSON.parse(data);

    console.log('Processing message at ' + message.date);

    getAppName.execute(message.app.id, message.app.key)
        .then(function (appName) {
            return createError.execute(message.error, appName)
                .then(function (error) {
                    console.log(error);
                    success++;
                    console.log({
                        sucess: success,
                        error: error
                    });
                });
        })
        .catch(function (err) {
            console.log(err);
            error++;
            console.log({
                sucess: success,
                error: error
            });
        });


});

subscriber.connect("tcp://localhost:5432");
