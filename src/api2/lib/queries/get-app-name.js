'use strict';

module.exports = function (promise, Q) {

    let defered = Q.defer();
    return {
        'execute': function (appId, appKey) {
            promise.then(function (db) {
                db.view('marinet', 'appName_by_appId', {
                    'key': appId + '_' + appKey
                }, function (err, body) {
                    if (err) {
                        defered.reject(err);
                    }
                    if (body && body.rows && body.rows[0])
                        defered.resolve(body.rows[0].value);

                    defered.reject({
                        status_code: 404,
                        message: 'Not found'
                    });
                });
            });

            return defered.promise;
        }
    }
}