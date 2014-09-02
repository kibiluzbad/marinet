'use strict';

module.exports = function (User, Q) {
    return {
        'execute': function (login) {
            let defered = Q.defer();
            User.findOne()
                .where('email').equals(login)
                .exec(function (err, user) {
                    if (err) defered.reject(err);
                    if (apps) defered.resolve(user);
                });

            return defered.promise;
        }
    }
}
