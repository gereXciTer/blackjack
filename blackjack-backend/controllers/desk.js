/**
 * Created with blackjack.
 * User: alexzad
 * Date: 2014-09-10
 * Time: 11:53 PM
 * To change this template use Tools | Templates.
 */
exports.init = function(app, mongoose) {
    var Desk = require('./../model/Desk.js').make(mongoose.Schema, mongoose);
    app.get('(/api)?/desks', function(req, res) {
        console.log('querying all desks');
        console.log('query is ' + req.query.query);
        var queryObj = {
            "$and": [{
                    "participant.email": req.user.name
                },
                (req.query.query ? JSON.parse(req.query.query) : {})
            ]
        };
        console.log("final query: " + JSON.stringify(queryObj));
        var query = Desk.where(queryObj);
        query.find(function(err, desks) {
            if(err) {
                handleError(req, res, err);
            } else if(desks == null) {
                console.log("internal server error when querying desks");
                res.status(500).send({
                    errorCode: 500,
                    errorMessage: "internal server error when querying desks"
                });
            } else {
                console.log('found: ' + JSON.stringify(desks));
                res.set("Content-type", "application/json");
                res.status(200).send(desks);
            }
        });
    });
    app.get('(/api)?/desks/:id', function(req, res) {
        var id = req.params[0];
        console.log('querying desk: ' + id);
        var query = Desk.where({
            _id: id
        });
        query.findOne(function(err, desk) {
            if(err) {
                handleError(req, res, err);
            } else if(desk == null) {
                console.log("desk " + id + " not found");
                res.status(404).send({
                    errorCode: 404,
                    errorMessage: "desk " + id + " not found"
                });
            } else {
                console.log('found: ' + JSON.stringify(desk));
                var invitees = desk.participant.concat(desk.guest).map(function(item) {
                    return item.email;
                });
                invitees.push(desk.owner);
                if(invitees.indexOf(req.user.name) == -1) {
                    console.log('user : ' + req.user.name + ' not among invitees: ' + JSON.stringify(invitees));
                    res.status(403).send({
                        errorCode: 403,
                        errorMessage: "You are not invited to this desk"
                    });
                } else {
                    var retVal = JSON.parse(JSON.stringify(desk));
                    if(req.user.name == retVal.owner) {
                        retVal.isOwner = true;
                        console.log('user : ' + req.user.name + ' is the owner');
                        console.log('desk updated with isOwner flag:' + JSON.stringify(retVal));
                    }
                    console.log('returning the desk:' + JSON.stringify(retVal));
                    res.set("Content-type", "application/json");
                    res.status(200).send(retVal);
                }
            }
        });
    });
    app.post('(/api)?/desks', function(req, res) {
        console.log('create desk: ' + JSON.stringify(req.body));
        console.log("Referer: " + req.get("Referer"));
        console.log("Origin: " + req.get("Origin"));
        var newDesk = new Desk(req.body);
        var query = Desk.where({
            deskName: newDesk.deskName
        });
        query.findOne(function(err, desk) {
            if(err) {
                handleError(req, res, err);
            } else if(desk != null) {
                console.log("desk " + desk.deskName + " already exists");
                res.status(400).send({
                    errorCode: 400,
                    errorMessage: "desk " + desk.deskName + " already exists"
                });
            } else {
                newDesk.save(function(err) {
                    if(err) {
                        handleError(req, res, err);
                    } else {
                        console.log('created with id: ' + newDesk._id);
                        res.set("Link", "</api/desks/" + newDesk._id + ">; rel=\"created-resource\"");
                        res.status(201).send({
                            deskId: newDesk._id
                        });
                        sendInvites(req, newDesk);
                    }
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
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport();

    function sendInvites(req, desk) {
        console.log("sending invite");
        var recipients = desk.owner;
        /*desk.participant.map(function(item) {
            return item.email;
        }).join(',');*/
        console.log("recipients: ", recipients);
        var origin = req.get("Origin");
        if(!origin) {
            origin = "https://austria-pearl.codio.io:9500";
            console.log("header Origin not provided, defaulting to " + origin);
        }
        var url = origin + "/desk/" + desk._id;
        console.log("sending url " + url);
        transporter.sendMail({
            from: "automailer@blackjack.e3s.epam.com",
            to: recipients,
            subject: "Please join planning poker session '" + desk.deskName + "'",
            text: url
        });
    }
    console.log("desk controller initialized");
};