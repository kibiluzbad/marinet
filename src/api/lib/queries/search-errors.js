'use strict';
const request = require('request');

module.exports = function (Q, config) {
    return {
        'execute': function (query, appName, page) {
            let defered = Q.defer();

            request.get(config.db + '/_fti/local/' + config.dbName + '/_design/errors/by_message?q=appName:' + appName + ' AND message:' + query + '~&include_docs=true&limit=25&skip=' + ((page - 1) * 25), function (res, body) {
                if (res.statusCode === 200) {
                    let errors = [];
                    body.rows.forEach(function (item) {
                        errors.push(item.doc);
                    });
                    defered.resolve({
                        currentPage: page,
                        sugestions: [],
                        totalPages: Math.ceil(body.total_rows / 25),
                        totalSize: body.total_rows,
                        data: errors
                    })
                } else {
                    defered.reject(res);
                }
            });

            return defered.promise;
        }
    }
}
