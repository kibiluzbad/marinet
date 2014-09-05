"use strict";

module.exports = function (mongoose) {
    let schema = mongoose.Schema({
        status: Number
    });

    schema.methods.addUser = function (user) {
        user.accountId = this.id;
    };

    schema.methods.addApp = function (app) {
        app.accountId = this.id;
    };

    return mongoose.model('Account', schema);
}
