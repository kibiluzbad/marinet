'use strict';

const
    log = require('npmlog'),
    express = require('express'),
    app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', function (req, res) {
    res.json('I\'m working...');
});

app.listen(app.get('port'), function () {
    log.info('SERVER', 'Express server listening on port ' + app.get('port'));
});