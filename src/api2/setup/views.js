module.exports = {
    by_appName: {
        map: function (doc) {
            if ('errors' in doc) {
                var emited = [];
                for (var i in doc.errors) {
                    var error = doc.errors[i];
                    var key = doc._id;
                    if (-1 == emited.indexOf(error.hash)) {
                        emit(key, error);
                        emited.push(key);
                    }
                }
            }
        }.toString()
    }
};