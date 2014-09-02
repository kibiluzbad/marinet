'use strict';

module.exports = function (App, Q) {
    return {
        'execute': function (accountId) {
            let defered = Q.defer();
            App.find()
                .where('accountId')
                .equals(accountId)
                .exec(function (err, apps) {
                    if (err) defered.reject(err);
                    if (apps) defered.resolve(apps);
                });
            return defered.promise;
        }
    }
}
