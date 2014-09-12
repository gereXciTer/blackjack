/**
 * Created with blackjack.
 * User: alexzad
 * Date: 2014-09-11
 * Time: 05:03 PM
 * To change this template use Tools | Templates.
 */
exports.init = function(app, mongoose) {
    var Vote = require("./../model/Vote.js").make(mongoose.Schema, mongoose);
    app.get("(/api)?/votes", function(req, res) {
        console.log("querying votes");
        var queryText = req.query.query || "{}";
        console.log("query is " + queryText);
        var query = Vote.where(JSON.parse(queryText));
        query.find(function(err, votes) {
            if(err) {
                handleError(req, res, err);
            } else if(votes == null) {
                console.log("internal server error when querying votes for story " + storyId);
                res.status(500).send({
                    errorCode: 500,
                    errorMessage: "internal server error when querying votes for story " + storyId
                });
            } else {
                console.log("found: " + JSON.stringify(votes));
                res.set("Content-type", "application/json");
                res.status(200).send(votes);
            }
        });
    });
    app.post("(/api)?/votes", function(req, res) {
        var body = req.body;
        console.log("create or update vote: " + JSON.stringify(body));
        body.email = req.user.name;
        console.log("ensuring email: " + body.email + " is set to submitting user: " + req.user.name);
        var newVote = new Vote(body);
        var queryParams = {
            storyId: newVote.storyId,
            email: newVote.email
        };
        console.log("query vote: " + JSON.stringify(queryParams));
        var query = Vote.where(queryParams);
        query.findOne(function(err, vote) {
            if(err) {
                handleError(req, res, err);
            } else if(vote != null) {
                console.log("vote found: " + vote._id + ", updating");
                Vote.update({
                    _id: vote._id
                }, {
                    estimate: newVote.estimate
                }, function(err) {
                    if(err) {
                        handleError(req, res, err);
                    } else {
                        console.log("vote id: " + vote._id + " updated with new estimate: " + newVote.estimate);
                        res.set("Content-type", "application/json");
                        res.status(200).send({
                            voteId: vote._id
                        });
                    }
                });
            } else {
                console.log("creating new vote");
                newVote.save(function(err) {
                    if(err) {
                        handleError(req, res, err);
                    } else {
                        console.log("vote created with id: " + newVote._id);
                        res.set("Link", "</api/votes/" + newVote._id + ">; rel=\"created-resource\"");
                        res.set("Content-type", "application/json");
                        res.status(201).send({
                            voteId: newVote._id
                        });
                    }
                });
            }
        });
    });

    function handleError(req, res, err) {
        console.log("error: " + JSON.stringify(err));
        res.status(500).send({
            errorCode: 500,
            errorMessage: "internal server error",
            innerError: err
        });
    }
    console.log("vote controller initialized");
};