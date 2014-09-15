/**
 * Created with blackjack.
 * User: alexzad
 * Date: 2014-09-13
 * Time: 06:54 AM
 * To change this template use Tools | Templates.
 */
exports.init = function(app, mongoose) {
    var User = require("./../model/User.js").make(mongoose.Schema, mongoose);
    app.get("(/api)?/desks/:0/users", function(req, res) {
        var timeout = parseInt(req.query.timeout || "30");
        var Desk = mongoose.model("Desk");
        var deskId = req.params[0];
        console.log("querying user statuses for desk: " + deskId);
        var query = Desk.where({
            _id: deskId
        });
        query.findOne(function(err, desk) {
            if(err) {
                handleError(req, res, err);
            } else if(desk == null) {
                console.log("desk " + deskId + " not found");
                res.status(404).send({
                    errorCode: 404,
                    errorMessage: "desk " + deskId + " not found"
                });
            } else {
                console.log("desk found");
                var retVal = {};
                var emails = desk.participant.map(function(item) {
                    retVal[item.email] = false;
                    return item.email;
                });
                console.log("participants are: " + JSON.stringify(emails));
                var query = User.where({
                    email: {
                        "$in": emails
                    }
                });
                query.find(function(err, users) {
                    if(err) {
                        handleError(req, res, err);
                    } else if(users) {
                        console.log("found statuses for: " + JSON.stringify(users));
                        users.map(function(item) {
                            console.log("mapping access time to online status");
                            var timeDiff = Math.abs(new Date() - new Date(item.lastAccessTime));
                            console.log("for: " + item.email + " diff between now: " + new Date().toISOString() + " and lastAccessTime: " + item.lastAccessTime + " is: " + timeDiff + " ms")
                            retVal[item.email] = timeDiff < (1000 * timeout);
                        });
                    }
                    res.set("Content-type", "application/json");
                    res.status(200).send(retVal);
                });
            }
        });
    });
    var e3s = require('./../modules/e3s-helper.js')
    app.get("(/api)?/photo/", function(req, res) {
        var id = req.query.id;
        if(id == "dummy") {
            res.sendFile('dummy.png', {
                root: __dirname
            });
        } else {
            e3s.proxyE3SReq(req, res, '/rest/e3s-app-logo-impl/v1/logo?uri=:id', {
                id: id
            }, function(body) {
                //res.status(200).end('<img src="data:image/gif;base64,' + new Buffer(body).toString('base64') + '" />');
                res.set("Content-type", "image/gif");
                res.set("Content-length", body.length);
                res.end(body, "binary");
            }, function(e) {
                var err = JSON.stringify(e);
                console.log("default error callback: " + err);
                res.status(500).send({
                    errorCode: 500,
                    errorMessage: "internal server error",
                    innerError: err
                });
            }, true);
        }
    });

    function handleError(req, res, err) {
        console.log("error: " + JSON.stringify(err));
        res.status(500).send({
            errorCode: 500,
            errorMessage: "internal server error",
            innerError: err
        });
    }
    console.log("user controller initialized");
};