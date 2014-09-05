"use strict";

module.exports = function (mongoose) {
    let schema = mongoose.Schema({
        hash: String,
        message: String,
        exception: String,
        currentUser: String,
        createdAt: Date,
        solved: Boolean,
        appName: String,
        selected: String,
        keys: [String],
    });

    return mongoose.model('Error', schema);
}
