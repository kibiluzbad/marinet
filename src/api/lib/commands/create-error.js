'use strict';

const
    crypto = require('crypto');

module.exports = function (Models, Q) {

    return {
        'execute': function (data, appName) {
            console.log('creating error');
            let defered = Q.defer();
            let hash = crypto.createHash('md5').update(JSON.stringify(data.message + data.exception + data.appName)).digest("hex");
            let error = new Models.Error(data);
            error.appName = appName;
            error.solved = false;
            error.hash = hash;

            error.save(function (err, error) {
                if (err) defered.reject(err);
                defered.resolve(error);
            });

            return defered.promise;
        }
    }
}
