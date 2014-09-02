'use strict';

const Q = require('q'),
    mongoose = require('mongoose');

module.exports = function (config, log) {
    let deferred = Q.defer();

    var db = mongoose.connection(config.db);

    db.on('error', function (err) {

        deferred.reject(err);
        log.error('mongodb', err);
    });
    db.once('open', function () {
        defered.resolve(mongoose);
    });

    return deferred.promise;
}
