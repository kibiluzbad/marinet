'use strict';

module.exports = function (promise, Q) {
    let defered = Q.defer();

    return {
        'execute': function (comment) {

            promise.then(function (db) {
                comment.type = 'comment';
                db.insert(comment, function (err, body) {
                    if (err) {
                        defered.reject(err);
                    } else
                        defered.resolve(body);
                });
            });

            return defered.promise;
        }
    }
}