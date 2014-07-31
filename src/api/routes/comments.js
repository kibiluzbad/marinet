'use strict';

function comments(app, queries, commands, authed) {
    app.get('/api/comments/:hash', authed, function (req, res) {
        queries.getCommentsByErrorHash
            .execute(req.params.hash)
            .then(function (errors) {
                res.json(errors);
            }).catch(function (err) {
                res.json(502, {
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });

    app.post('/api/comment', function (req, res) {
        let comment = req.body;
        comment.name = req.user.name;
        comment.role = req.user.role;
        comment.createdAt = new Date();

        commands.createComment.execute(comment)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                res.json(502, {
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });
}

module.exports = comments;