'use strict';
const
    async = require('async'),
    request = require('request'),
    environment = process.env.NODE_ENV || 'development',
    config = require('./config/' + environment + '.js');



async.waterfall([
 // get the existing design doc (if present)
function (next) {
        request.get(config.db + config.dbName + '/_design/errors', next);
},
 // create a new design doc or use existing
function (res, body, next) {
        if (res.statusCode === 200) {
            next(null, JSON.parse(body));
        } else if (res.statusCode === 404) {
            next(null, {
                fulltext: {}
            });
        }
},

function (doc, next) {
        doc.fulltext = {
            by_message: {
                index: function (doc) {
                    if (doc.type === 'grouped_error') {
                        var ret = new Document();
                        ret.add(doc.message, {
                            'field': 'message'
                        });
                        ret.add(doc.appName, {
                            'field': 'appName'
                        });
                        ret.add(doc.createdAt, {
                            'field': 'createdAt',
                            'type': 'date'
                        });
                        ret.add(doc.solved, {
                            'field': 'solved'
                        });
                        return ret;
                    }
                }.toString()
            },
            analyzer: "perfield:{message:'english', appName:'standard'}"
        };

        request({
            method: 'PUT',
            url: config.db + config.dbName + '/_design/errors',
            json: doc
        }, next);
}], function (err, res, body) {
    if (err) {
        throw err;
    }
    console.log(res.statusCode, body);
});
