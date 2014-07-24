'use strict';

const
    environment = process.env.NODE_ENV || 'development',
    log = require('npmlog'),
    logger = require('morgan'),
    config = require('./config/' + environment + '.js'),
    express = require('express'),
    deferedDb = require('./setup/db.js')(config, log),
    bodyParser = require('body-parser'),
    app = express();

app.use(bodyParser.json())
app.use(logger('combined'));
app.set('port', process.env.PORT || 3000);

const
    errors = require('./routes/errors.js')(app, deferedDb),
    account = require('./routes/account.js')(app, deferedDb, config),
    application = require('./routes/application.js')(app, deferedDb, config);

app.get('/', function (req, res) {
    res.json('I\'m working...');
});

app.listen(app.get('port'), function () {
    log.info('SERVER', 'Express server listening on port ' + app.get('port'));
});