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
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    cors = require('express-cors'),
    app = express(),
    zmq = require('zmq'),
    publisher = zmq.socket('pub'),
    Marinet = require('marinet-provider-nodejs'),
    provider = new Marinet(config.marinet);

console.log(provider);

let redisClient = {},
    RedisStore = {};

if ('production' === environment) {
    redisClient = require('redis').createClient();
    RedisStore = require('connect-redis')(session);
}

const
    queries = {
        'getAppErrors': require('./lib/queries/get-app-errors.js')(deferedDb, Q),
        'getAccountApps': require('./lib/queries/get-account-apps.js')(deferedDb, Q),
        'getAppName': require('./lib/queries/get-app-name.js')(deferedDb, Q),
        'getErrorsByHash': require('./lib/queries/get-errors-by-hash.js')(deferedDb, Q),
        'getAppByName': require('./lib/queries/get-app-by-name.js')(deferedDb, Q),
        'getUserById': require('./lib/queries/get-user-by-id.js')(deferedDb, Q),
        'getUserByLogin': require('./lib/queries/get-user-by-login.js')(deferedDb, Q),
        'getErrorsById': require('./lib/queries/get-errors-by-id.js')(deferedDb, Q),
        'getCommentsByErrorHash': require('./lib/queries/get-comments-by-error-hash.js')(deferedDb, Q),
        'searchErrors': require('./lib/queries/search-errors.js')(Q, config),
    },
    commands = {
        'createError': require('./lib/commands/create-error.js')(deferedDb, Q),
        'initialSetup': require('./lib/commands/initial-setup.js')(deferedDb, Q),
        'createApp': require('./lib/commands/create-app.js')(deferedDb, Q),
        'solveErrors': require('./lib/commands/solve-errors.js')(deferedDb, Q),
        'validatePassword': require('./lib/commands/validate-password.js')(Q),
        'createComment': require('./lib/commands/create-comment.js')(deferedDb, Q),
    };

app.use(cors({
    allowedOrigins: config.allowedOrigins
}));
app.use(bodyParser.json());
//app.use(logger('combined'));
app.set('port', process.env.PORT || 3000);

const authed = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else if (redisClient.ready || 'production' !== environment) {
        res.status(403).json({
            error: "forbidden",
            reason: "not_authenticated"
        });
    } else {
        res.status(503).json({
            error: "service_unavailable",
            reason: "authentication_unavailable"
        });
    }
};

if (environment === 'production')
    redisClient
    .on('ready', function () {
        log.info('REDIS', 'ready');
    })
    .on('error', function (err) {
        log.error('REDIS', err.message);
    });

passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (username, done) {
    queries.getUserByLogin.execute(username)
        .then(function (user) {
            done(null, user);
        }).catch(function (err) {
            done(err, null);
        });
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        queries.getUserByLogin.execute(username).then(function (user) {
            if (commands.validatePassword.execute(password, user))
                done(null, user);
            else
                done(403, false, {
                    message: 'Incorrect username or password.'
                });

        }).catch(function (err) {
            done(403, false, {
                message: 'User not found.'
            });
        });
    }
));

app.use(cookieParser());
app.use(session({
    secret: 'eae79eb5-5a0d-4e14-9071-a38b02c4d712',
    saveUninitialized: true,
    resave: true,
    store: environment === 'production' ? new RedisStore({
        client: redisClient
    }) : null
}));
app.use(passport.initialize());
app.use(passport.session());

const
    errors = require('./routes/errors.js')(app, queries, commands, authed, publisher),
    account = require('./routes/account.js')(app, config, queries, commands, authed, passport),
    application = require('./routes/application.js')(app, config, commands, authed),
    comments = require('./routes/comments.js')(app, queries, commands, authed);

app.get('/', function (req, res) {
    res.json('I\'m working...');
});


app.use(function (err, req, res, next) {
    if (err.message && err.stack) {
        provider.error({
            currentUser: req.user ? req.user.name : 'unauthenticated',
            message: err.message,
            exception: err.stack,
            createdAt: new Date().toISOString().replace(/\..+/, '')
        });
    }

    next(err);
});


publisher.bind('tcp://*:5432', function (err) {
    if (!err)
        log.info('0MQ', 'Listening for zmq subscribers...');
    else
        log.error(err);
});

app.listen(app.get('port'), function () {
    log.info('SERVER', 'Express server listening on port ' + app.get('port'));
    log.info('SERVER', environment + ' mode.');
});
