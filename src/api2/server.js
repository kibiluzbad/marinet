'use strict';

const
    environment = process.env.NODE_ENV || 'development',
    log = require('npmlog'),
    logger = require('morgan'),
    config = require('./config/' + environment + '.js'),
    express = require('express'),
    deferedDb = require('./setup/db.js')(config, log),
    bodyParser = require('body-parser'),
    Q = require('q'),
    app = express();

app.use(bodyParser.json())
app.use(logger('combined'));
app.set('port', process.env.PORT || 3000);

const
    queries = {
        'errorsByAppName': require('./lib/queries/errors-by-name-query.js')(deferedDb, Q),
        'getAccountApps': require('./lib/queries/get-account-apps.js')(deferedDb, Q),
        'getAppName': require('./lib/queries/get-app-name.js')(deferedDb, Q),
        'getErrorsByHash': require('./lib/queries/get-errors-by-hash.js')(deferedDb, Q),
        'getAppByName': require('./lib/queries/get-app-by-name.js')(deferedDb, Q),
    },
    commands = {
        'createError': require('./lib/commands/create-error.js')(deferedDb, Q),
        'initialSetup': require('./lib/commands/initial-setup.js')(deferedDb, Q),
        'createApp': require('./lib/commands/create-app.js')(deferedDb, Q),
        'solveErrorsByHash': require('./lib/commands/solve-errors-by-hash.js')(deferedDb, Q),
    };

const
    errors = require('./routes/errors.js')(app, queries, commands),
    account = require('./routes/account.js')(app, config, queries, commands),
    application = require('./routes/application.js')(app, config, commands);

app.get('/', function (req, res) {
    res.json('I\'m working...');
});

app.listen(app.get('port'), function () {
    log.info('SERVER', 'Express server listening on port ' + app.get('port'));
});