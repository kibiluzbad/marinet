'use strict';

const Q = require('q');

module.exports = function (config, log) {
    let deferred = Q.defer();
    const nano = require('nano')({
        "url": config.db,
        "log": function (id, args) {
            log.info("COUCHDB", args);
        }
    });

    nano.db.get(config.dbName, function (err, body) {
        if (err && err.status_code === 404) {
            log.info('COUCHDB', 'DB not found, creating db file.');
            nano.db.create(config.dbName, function (err, body) {
                if (!err) {
                    log.info('COUCHDB', config.dbName + ' db created.');
                    deferred.resolve(nano.db.use(config.dbName));
                } else {
                    deferred.reject(err);
                }
            });
        } else {
            deferred.resolve(nano.db.use(config.dbName));
        }
    });

    return deferred.promise;
}