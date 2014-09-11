/**
 * Created with blackjack.
 * User: alexzad
 * Date: 2014-09-11
 * Time: 02:35 PM
 * To change this template use Tools | Templates.
 */
exports.init = function(app, mongoose) {
    var Story = require('./../model/Story.js').make(mongoose.Schema, mongoose);
    app.get('(/api)?/desks/:deskId/stories', function(req, res) {
        var deskId = req.params[0];
        console.log('querying all stories for desk: ' + deskId);
        var queryText = "{\"$and\":[{\"deskId\":\"" + deskId + "\"}," + (req.query.query || "{}") + "]}";
        console.log('query is ' + queryText);
        var query = Story.where(JSON.parse(queryText));
        query.find(function(err, stories) {
            if(err) {
                handleError(req, res, err);
            } else if(stories == null) {
                console.log("internal server error when querying stories for desk " + deskId);
                res.status(500).send({
                    errorCode: 500,
                    errorMessage: "internal server error when querying stories for desk " + deskId
                });
            } else {
                console.log('found: ' + JSON.stringify(stories));
                res.set("Content-type", "application/json");
                res.status(200).send(stories);
            }
        });
    });
    app.get('(/api)?/desks/:0/stories/:1', function(req, res) {
		console.log(req.params); 
        console.log("weird body-parser defect screws up params =(");
        var deskId = req.params[1];
        var storyId = req.params[0];
        console.log('querying story: ' + storyId + ' for desk: ' + deskId);
        var query = Story.where({
            _id: storyId,
            deskId: deskId
        });
        query.findOne(function(err, story) {
            if(err) {
                handleError(req, res, err);
            } else if(story == null) {
                console.log("story " + deskId + " not found in desk " + storyId);
                res.status(404).send({
                    errorCode: 404,
                    errorMessage: "story " + deskId + " not found in desk " + storyId
                });
            } else {
                console.log('found: ' + JSON.stringify(story));
                res.set("Content-type", "application/json");
                res.status(200).send(story);
            }
        });
    });
    app.post('(/api)?/desks/:deskId/stories', function(req, res) {
        var deskId = req.params[0];
        console.log('create story: ' + JSON.stringify(req.body) + ' in desk: ' + deskId);
        var story = new Story(req.body);
        story.deskId = deskId;
        story.save(function(err) {
            if(err) {
                handleError(req, res, err);
            } else {
                console.log('story created with id: ' + story._id);
                res.set("Link", "</api/desks/" + deskId + "/" + story._id + ">; rel=\"created-resource\"");
                res.status(201).send({
                    storyId: story._id
                });
            }
        });
    });
    app.get('(/api)?/desks/:deskId/_stories_add', function(req, res) {
        var deskId = req.params[0];
        var data = {
            "summary": "test story2",
            "estimate": "-1",
            "active": "false",
            "revealed": "false",
            "deskId": deskId
        };
        console.log('create story: ' + JSON.stringify(data) + ' in desk: ' + deskId);
        var story = new Story(data);
        story.deskId = deskId;
        story.save(function(err) {
            if(err) {
                handleError(req, res, err);
            } else {
                console.log('story created with id: ' + story._id);
                res.set("Link", "</api/desks/" + deskId + "/" + story._id + ">; rel=\"created-resource\"");
                res.status(201).send({
                    storyId: story._id
                });
            }
        });
    });

    function handleError(req, res, err) {
        console.log('error: ' + JSON.stringify(err));
        res.status(500).send({
            errorCode: 500,
            errorMessage: "internal server error",
            innerError: err
        });
    }
};