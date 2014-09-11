/**
 * Created with blackjack.
 * User: alexzad
 * Date: 2014-09-10
 * Time: 11:53 PM
 * To change this template use Tools | Templates.
 */
exports.init = function(app) {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://blackjackapp:pAssword1!@ds035740.mongolab.com:35740/blackjack');
    var Desk = require('./../model/Desk.js').make(mongoose.Schema, mongoose);
    app.get('(/api)?/desks', function(req, res) {
        console.log('querying all desks');
        var query = req.query.query ? Desk.where(JSON.parse(req.query.query)) : Desk.where();
        query.find(function(err, desks) {
            if(err) {
                handleError(req, res, err);
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
            } else {
                console.log('found: ' + JSON.stringify(desk));
                res.set("Content-type", "application/json");
                res.status(200).send(desk);
            }
        });
    });
    app.post('(/api)?/desks', function(req, res) {
        console.log('create desk: ' + JSON.stringify(req.body));
        console.log("Referer: " + req.get("Referer"));
        console.log("Origin: " + req.get("Origin"));
        var desk = new Desk(req.body);
        desk.save(function(err) {
            if(err) {
                handleError(req, res, err);
            } else {
                console.log('created with id: ' + desk._id);
                res.set("Link", "</api/desks/" + desk._id + ">; rel=\"created-resource\"");
                res.status(201).send({
                    deskId: desk._id
                });
                sendInvites(req, desk);
            }
        });
    });
    app.put('(/api)?/desks/:id', function(req, res) {
        var id = req.params[0];
        console.log('updating desk: ' + id);
        var query = Desk.where({
            _id: id
        });
        console.log('with: ' + JSON.stringify(req.body));
        query.update(req.body, function(err) {
            if(err) {
                handleError(req, res, err);
            } else {
                console.log('updated successfully');
                res.status(204).end();
            }
        });
    });

    function handleError(req, res, err) {
        console.log('error: ' + JSON.stringify(err));
        res.status(500).send(err);
    }
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport();

    function sendInvites(req, desk) {
        var recipients = 
//             desk.participant.join(',') + ',' + 
            desk.guest.join(',');
        console.log("sending invite to: " + recipients);
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
};