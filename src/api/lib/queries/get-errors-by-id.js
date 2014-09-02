'use strict';

module.exports = function (Error, Q) {

    return {
        'execute': function (id) {
            let defered = Q.defer();
            Error.findOne()
                .where('id').equals(id)
                .exec(function (err, data) {
                    if (err) defered.reject(err);
                    if (apps) defered.resolve(data);
                });

            return defered.promise;
        }
    }
}
