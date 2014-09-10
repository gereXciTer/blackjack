/**
 * Created with blackjack.
 * User: alexzad
 * Date: 2014-09-09
 * Time: 02:29 PM
 */
(function() {
    var express = require('express');
    var app = express();
    var auth = require('./modules/express-http-basic.js');
    var e3s = require('./modules/e3s-helper.js')
    app.use(auth.basic);
    console.log("http basic auth enabled");
    app.get('(/api)?/employee', function(req, res) {
        e3s.proxyE3SReq(req, res, '/rest/e3s-eco-scripting-impl/0.1.0/data/select?type=com.epam.e3s.app.people.api.data.EmployeeEntity&fields=projectall,fullNameSum,upsaidSum&query={%22email%22:colon%22:email%22}', {
            "email": req.user.name
        });
    });
    app.get('(/api)?/project', function(req, res) {
        e3s.proxyE3SReq(req, res, '/rest/e3s-eco-scripting-impl/0.1.0/data/select?type=com.epam.e3s.app.project.api.data.ProjectProjectionEntity&query={%22name%22:colon%22:query%22}&fields=teamUpsaIds', {
            query: req.query.name
        }, function(body) {
            var items = JSON.parse(body)[0].teamUpsaIds;
            e3s.proxyE3SReq(req, res, '/rest/e3s-eco-scripting-impl/0.1.0/data/select?type=com.epam.e3s.app.people.api.data.EmployeeEntity&query={%22upsaidSum%22:colon{%22$in%22:colon1:teamUpsaIds}}&fields=fullNameSum,upsaidSum&limit=100', {
                teamUpsaIds: JSON.stringify(items)
            });
        });
    });
    
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://blackjackapp:pAssword1!@ds035740.mongolab.com:35740/blackjack');
    var Vote = require('./model/Vote.js').make(mongoose.Schema, mongoose);
    var Story = require('./model/Story.js').make(mongoose.Schema, mongoose);
    var Person = require('./model/Person.js').make(mongoose.Schema, mongoose);
    var Desk = require('./model/Desk.js').make(mongoose.Schema, mongoose);
    app.get('(/api)?/desks', function(req, res) {
        var query = req.query.query ? Desk.where(JSON.parse(req.query.query)) : Desk.where();
        query.find(function(err, rooms) {
            if(err) {
                res.set(500).send(err);
            } else {
                res.set("Content-type", "application/json");
                res.status(200).send(rooms);
            }
        });
    });
    app.get('(/api)?/desks/:id', function(req, res) {
        var query = Desk.where({
            _id: req.params.id
        });
        query.findOne(function(err, room) {
            if(err) {
                res.set(500).send(err);
            } else {
                res.set("Content-type", "application/json");
                res.status(200).send(room);
            }
        });
    });
    app.post('(/api)?/desks', function(req, res) {
        var room = new Desk(JSON.parse(req.body));
        room.save(function(err) {
            if(err) {
                res.status(500).send(err);
            } else {
                res.set("Link", "</api/desks/" + room._id + ">; rel=\"created-resource\"");
                res.status(201).send();
            }
        });
    });
    app.put('(/api)?/desks/:id', function(req, res) {
        var query = Desk.where({
            _id: req.params.id
        });
        query.update(JSON.parse(req.body), function(err) {
            if(err) {
                res.status(500).send(err);
            } else {
                res.set("Link", "</api/desks/" + room._id + ">; rel=\"created-resource\"");
                res.status(204).send();
            }
        });
    });
    app.get('(/api)?/send', function(req, res) {
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport();
        transporter.sendMail({
            from: 'automailer@blackjack.e3s.com',
            to: 'alexey_zadorozhny@epam.com,volodymyr_hartsev@epam.com',
            subject: 'Please join planning poker session',
            text: 'https://austria-pearl.codio.io:9500/desks/id'
        });
        res.status(200).end();
    });
    app.listen(3334);
    console.log("listening on 3334");
}());