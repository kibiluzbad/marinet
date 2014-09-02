'use strict';

module.exports = function (Comment, Q) {
    return {
        'execute': function (hash) {
            let defered = Q.defer();
            Comment.find()
                .where('hash').equals(hash)
                .exec(function (err, comments) {
                    if (err) defered.reject(err);
                    if (apps) defered.resolve(comments);
                });

            return defered.promise;
        }
    }
}
