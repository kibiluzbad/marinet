module.exports = {
    unique_errors: {
        map: function (doc) {
            if (doc.type === 'grouped_error') {
                var error = doc;
                var key = doc.appName;
                emit(key, error._id);
            }
        }.toString()
    },
    appName_by_appId: {
        map: function (doc) {
            if (doc.type === 'account') {
                for (var i in doc.apps) {
                    var app = doc.apps[i];
                    var key = app.id + '_' + app.key;
                    emit(key, app.name);
                }
            }
        }.toString()
    },
    user_by_id: {
        map: function (doc) {
            if (doc.type === 'account') {
                for (var i in doc.users) {
                    var user = doc.users[i];
                    var key = user.id;
                    var value = {
                        'accountId': doc._id,
                        'id': key,
                        'name': user.name,
                        'password': user.password,
                        'role': user.role
                    };
                    emit(key, value);
                }
            }
        }.toString()
    },
    user_by_login: {
        map: function (doc) {
            if (doc.type === 'account') {
                for (var i in doc.users) {
                    var user = doc.users[i];
                    var key = user.login;
                    var value = {
                        'accountId': doc._id,
                        'id': key,
                        'name': user.name,
                        'password': user.password,
                        'role': user.role
                    };
                    emit(key, value);
                }
            }
        }.toString()
    },
    comments_by_error_hash: {
        map: function (doc) {
            if (doc.type === 'comment') {
                var key = [doc.hash, doc._id];
                emit(key, null);
            }
        }.toString()
    }
};
