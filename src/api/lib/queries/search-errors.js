'use strict';

module.exports = function (Models, Q) {
    return {
        'execute': function (filter, page) {
            let defered = Q.defer();
            /*    url = config.db + '_fti/local/' + config.dbName + '/_design/errors/by_message?sort=' + encodeURIComponent(filter.sort) + 'createdAt%3Cdate%3E&include_docs=true&limit=25&skip=' + ((page - 1) * 25) + '&q=appName:' + filter.appName;


            if (filter.query) url += ' AND message:' + filter.query + '~';
            url += ' AND solved:' + filter.solved.toString();

            console.log(url);
            request.get(url, function (res, body) {
                let result = JSON.parse(body.body);

                if (!result.rows) defered.reject(body);
                else {
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
                    });
                }
            });*/

            let match = {
                $match: {
                    appName: {
                        $eq: filter.appName
                    },
                    solved: {
                        $eq: filter.solved
                    }
                }
            };
            if (filter.query) {
                match.$match.$text = {
                    $search: filter.query,
                    $language: "en"
                }
            }

            Models.Error.aggregate([
                match,
                {
                    $group: {
                        _id: {
                            hash: "$hash",
                            appName: "$appName"
                        },
                        hash: {
                            $last: "$hash"
                        },
                        message: {
                            $last: "$message"
                        },
                        exception: {
                            $last: "$exception"
                        },
                        createdAt: {
                            $last: "$createdAt"
                        },
                        solved: {
                            $last: "$solved"
                        },
                        count: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        createdAt: filter.sort
                    }
                },
            ]).exec(function (err, errors) {
                if (err) defered.reject(err);
                if (errors) defered.resolve({
                    currentPage: page,
                    sugestions: [],
                    totalPages: 1, //Math.ceil(errors.length/ 25),
                    totalSize: errors.length,
                    data: errors
                });
            });

            return defered.promise;
        }
    }
}
