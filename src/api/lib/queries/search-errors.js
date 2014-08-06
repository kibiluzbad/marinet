'use strict';
const request = require('request');

module.exports = function (Q, config) {
    return {
        'execute': function (query, appName, page) {
            let defered = Q.defer(),
                url = config.db + '_fti/local/' + config.dbName + '/_design/errors/by_message?sort=%5CcreatedAt%3Cdate%3E&include_docs=true&limit=25&skip=' + ((page - 1) * 25) + '&q=appName:' + appName;

            console.log(url);
            if (query) url += ' AND message:' + query + '~';


            request.get(url, function (res, body) {
                let result = JSON.parse(body.body);
                console.log(result);
                //if (res.statusCode === 200) {
                let errors = [];
                result.rows.forEach(function (item) {
                    errors.push(item.doc);
                });
                defered.resolve({
                    currentPage: page,
                    sugestions: [],
                    totalPages: Math.ceil(result.total_rows / 25),
                    totalSize: result.total_rows,
                    data: errors
                })
                //} else {
                //defered.reject(res);
                //}
            });

            return defered.promise;
        }
    }
}
