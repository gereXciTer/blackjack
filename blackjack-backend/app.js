/**
 * Created with blackjack.
 * User: alexzad
 * Date: 2014-09-09
 * Time: 02:29 PM
 */
(function() {
    var express = require('express');
    var auth = require('basic-auth');
    var https = require('https')
    var app = express();
    app.get('/api/employee', function(req, res) {
        var user = auth(req);
        if(!user) {
            res.set("WWW-Authenticate", "Basic");
            res.status(401).end();
            return;
        } else {
            var options = {
                host: 'e3s.epam.com',
                port: 443,
                headers: {
                    "Authorization": req.headers.authorization
                },
                path: '/rest/e3s-eco-scripting-impl/0.1.0/data/select?type=com.epam.e3s.app.people.api.data.EmployeeEntity&fields=projectall,fullNameSum.full,upsaidSum&query={%22email%22:%22' + user.name + '%22}'
            };
            https.get(options, function(resp) {
                var body = "";
                resp.on('data', function(chunk) {
                    body += chunk;
                });
                resp.on('end', function() {
            		res.set("Content-type", "application/json");
                    res.status(200).send(body);
                });
            }).on("error", function(e) {
                res.status(500).send(e);
            });
        }
    });
    /*
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://blackjackapp:pAssword1!@ds035740.mongolab.com:35740/blackjack');
    //    var Vote = require('./model/Vote.js').make(mongoose.Schema, mongoose);
    //    var Story = require('./model/Story.js').make(mongoose.Schema, mongoose);
    //    var Person = require('./model/Person.js').make(mongoose.Schema, mongoose);
    var Room = require('./model/Room.js').make(mongoose.Schema, mongoose);

    app.get('/rooms', function(req, res) {
        var query = req.query.query ? Room.where(JSON.parse(req.query.query)) : Room.where();
        query.find(function(err, rooms) {
            if(err) {
                res.set(500).send(err);
            } else {
                res.set("Content-type", "application/json");
                res.status(200).send(rooms);
            }
        });
    });
    app.get('/rooms/:id', function(req, res) {
        var query = Room.where({
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
    app.post('/rooms', function(req, res) {
        var room = new Room(JSON.parse(req.body));
        room.save(function(err) {
            if(err) {
                res.status(500).send(err);
            } else {
                res.set("Link", "</rooms/" + room._id + ">; rel=\"created-resource\"");
                res.status(201).send();
            }
        });
    });
    app.put('/rooms/:id', function(req, res) {
        var query = Room.where({
            _id: req.params.id
        });
        query.update(JSON.parse(req.body), function(err) {
            if(err) {
                res.status(500).send(err);
            } else {
                res.set("Link", "</rooms/" + room._id + ">; rel=\"created-resource\"");
                res.status(204).send();
            }
        });
    });
    // internal
    app.get('/rooms_add', function(req, res) {
        var room = new Room({
            name: "Test room",
            deck: "Fibonacci",
            active: true,
            projectName: "UBS-WMA",
            people: [{
                upsaId: "4000625400000002447",
                name: "Alexey Zadorozhny",
                email: "alexey_zadorozhny@epam.com",
                online: true
            }, {
                upsaId: "4060741400008484376",
                name: "Volodymyr Hartsev",
                email: "volodymyr_hartsev@epam.com",
                online: false
            }],
            stories: [{
                summary: "Story ABC",
                estimate: 5,
                active: false,
                revealed: true,
                votes: [{
                    upsaId: "4060741400008484376",
                    estimate: 5
                }, {
                    upsaId: "4000625400000002447",
                    estimate: 8
                }]
            }, {
                summary: "Story ABC",
                estimate: 5,
                active: true,
                revealed: false,
                votes: [{
                    upsaId: "4060741400008484376",
                    estimate: 3
                }]
            }, {
                summary: "Story ABC",
                estimate: -1,
                active: false,
                revealed: false,
                votes: []
            }],
        });
        room.save(function(err) {
            if(err) {
                res.status(500).send(err);
            } else {
                res.set("Link", "</rooms/" + room._id + ">; rel=\"created-resource\"");
                res.status(201).send("created");
            }
        });
    });*/
    app.listen(3334);
}());