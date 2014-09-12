/**
 * Created with blackjack.
 * User: alexzad
 * Date: 2014-09-11
 * Time: 02:35 PM
 * To change this template use Tools | Templates.
 */
exports.init = function(app, mongoose) {
    var Story = require("./../model/Story.js").make(mongoose.Schema, mongoose);
    app.get("(/api)?/stories", function(req, res) {
        console.log("querying all stories");
        var queryText = req.query.query || "{}";
        console.log("query is " + queryText);
        var query = Story.where(JSON.parse(queryText));
        query.find(function(err, stories) {
            if(err) {
                handleError(req, res, err);
            } else if(stories == null) {
                console.log("internal server error when querying stories for query " + queryText);
                res.status(500).send({
                    errorCode: 500,
                    errorMessage: "internal server error when querying stories for query " + queryText
                });
            } else {
                console.log("found: " + JSON.stringify(stories));
                res.set("Content-type", "application/json");
                res.status(200).send(stories);
            }
        });
    });
    app.post("(/api)?/stories", function(req, res) {
        console.log("create story: " + JSON.stringify(req.body));
        var story = new Story(req.body);
        story.save(function(err) {
            if(err) {
                handleError(req, res, err);
            } else {
                console.log("story created with id: " + story._id);
                res.set("Link", "</api/stories/" + story._id + ">; rel=\"created-resource\"");
                res.status(201).send({
                    storyId: story._id
                });
            }
        });
    });
    app.put("(/api)?/stories/:0", function(req, res) {
        console.log("create story: " + JSON.stringify(req.body));
        var id = req.params[0];
        var query = Story.where({
            _id: id
        });
        var newVal = req.body;
        query.findOne(function(err, story) {
            if(err) {
                handleError(req, res, err);
            } else if(story == null) {
                console.log("story " + id + " not found");
                res.status(404).send({
                    errorCode: 404,
                    errorMessage: "story " + id + " not found"
                });
            } else {
                console.log('found: ' + JSON.stringify(story));
                console.log('newVal.active: ' + newVal.active);
                console.log('newVal.active == true: ' + (newVal.active == "true"));
                console.log('story.active != newVal.active: ' + (story.active != newVal.active));
                if(newVal.active && newVal.active == "true" && story.active != newVal.active) {
                    console.log("requested to activate story: " + id + ", resetting other stories in desk: " + story.deskId);
                    Story.update({
                        deskId: story.deskId
                    }, {
                        active: false
                    }, { multi: true }, function(err, numberAffected) {
                        if(err) {
                            console.log("failed to reset stories, error: " + JSON.stringify(err));
                            res.status(500).send({
                                errorCode: 500,
                                errorMessage: "failed to reset stories",
                                innerError: err
                            });
                            return;
                        } else {
                            console.log(numberAffected + " stories in desk: " + story.deskId + " deactivated");
		                    updateStory(req, res, id, newVal);
                        }
                    });
                } else {
                    updateStory(req, res, id, newVal);
                }                
            }
        });
    });

    function updateStory(req, res, id, newVal) {
        delete newVal["_id"];
        delete newVal["deskId"];
        Story.update({
            _id: id
        }, newVal, function(err) {
            if(err) {
                handleError(req, res, err);
            } else {
                console.log("story id: " + id + " updated with new values: " + JSON.stringify(newVal));
                res.set("Content-type", "application/json");
                res.status(200).send({
                    storyId: id
                });
            }
        });
    }

    function handleError(req, res, err) {
        console.log("error: " + JSON.stringify(err));
        res.status(500).send({
            errorCode: 500,
            errorMessage: "internal server error",
            innerError: err
        });
    }
    console.log("story controller initialized");
};