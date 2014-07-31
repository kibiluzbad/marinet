'use strict';

module.exports = function (promise, Q) {

    return {
        'execute': function (comment) {
            let defered = Q.defer();

            promise.then(function (db) {
                comment.type = 'comment';
                db.insert(comment, function (err, body) {
                    if (err) {
                        defered.reject(err);
                    } else {
                        comment._id = body._id;
                        defered.resolve(comment);
                    }
                });
            });

            return defered.promise;
        }
    }
}