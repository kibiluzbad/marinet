"use strict";

module.exports = function (mongoose) {
    let schema = mongoose.Schema({
        id: String,
        status: Number
    });

    return mongoose.model('Account', schema);
}
