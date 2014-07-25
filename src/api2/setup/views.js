module.exports = {
    by_appName: {
        map: function (doc) {
            //TODO: Performance test!
            var emited = {};
            var q = [];
            if ('errors' in doc) {
                for (var i in doc.errors) {
                    var error = doc.errors[i];
                    var key = doc._id + '_' + error.hash;
                    if (!emited[key]) {
                        q.push({
                            'k': key,
                            'd': error
                        });
                        emited[key] = 1;
                    } else {
                        emited[key]++;
                    }
                }
                for (var c in q) {
                    emit(q[c].k, {
                        'count': emited[q[c].k],
                        'error': q[c].d
                    });
                }
            }
        }.toString()
    },
    appName_by_appId: {
        map: function (doc) {
            if ('apps' in doc) {
                for (var i in doc.apps) {
                    var app = doc.apps[i];
                    var key = app.id + '_' + app.key;
                    emit(key, app.name);
                }
            }
        }.toString()
    }
};