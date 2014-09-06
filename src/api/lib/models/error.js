"use strict";
const textSearch = require("mongoose-text-search");

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


    schema.plugin(textSearch);
    schema.index({
        message: "text",
        exception: "text"
    });

    return mongoose.model('Error', schema);
}
