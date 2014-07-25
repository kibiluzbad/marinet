'use strict';

module.exports = function (promise, Q) {
    let defered = Q.defer();

    return {
        'execute': function (appName) {
            promise.then(function (db) {
                db.view('marinet', 'by_appName', {
                    'key': appName
                }, function (err, body) {
                    if (err) {
                        defered.reject(err);
                    }
                    let apps = [];
                    body.rows.forEach(function (doc) {
                        apps.push(doc.value);
                    });
                    defered.resolve(apps);
                });
            });

            return defered.promise;
        }
    }
}