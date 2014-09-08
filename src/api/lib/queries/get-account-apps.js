'use strict';

module.exports = function (Models, Q) {
    return {
        'execute': function (accountId) {
            let defered = Q.defer();
            Models.App.find()
                .where('accountId')
                .equals(accountId)
                .exec(function (err, apps) {
                    if (err) defered.reject(err);
                    if (apps) {
                        let names = [];

                        for (let i = 0; i < apps.length; i++) {
                            names.push(apps[i].name);
                        }

                        Models.Error.aggregate([{
                                $match: {
                                    appName: {
                                        $in: names
                                    },
                                    accountId: accountId
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        accountId: '$accountId',
                                        appName: '$appName'
                                    },
                                    count: {
                                        $sum: 1
                                    }
                                }
                        }]).exec(function (err, result) {
                            if (err) defered.reject(err);
                            let values = [];

                            for (let i = 0; i < result.length; i++) {
                                values.push({
                                    name: result[i]._id.appName,
                                    errors: result[i].count
                                });
                            }

                            defered.resolve(values);
                        });
                    } else defered.resolve([]);
                });
            return defered.promise;
        }
    }
}
