'use strict';

module.exports = function (Error, Q) {
    return {
        'execute': function (appName, hash) {
            let defered = Q.defer();
            Error.find()
                .where('hash').equals(hash)
                .where('appName').equals(hash)
                .exec(function (err, data) {
                    if (err) defered.reject(err);
                    if (apps) defered.resolve(data);
                });

            return defered.promise;
        }
    }
}
