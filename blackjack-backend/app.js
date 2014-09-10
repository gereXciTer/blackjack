/**
 * Created with blackjack.
 * User: alexzad
 * Date: 2014-09-09
 * Time: 02:29 PM
 */
(function() {
    var eut = require('express-uri-template');
    var express = require('express');
    var auth = require('basic-auth');
    var https = require('https')
    var app = express();
    /*app.use(function(req, res, next) {
        if(req.protocol !== "https") {
            res.status(400).send("HTTP is not supported! Please use HTTP<b>S</b>.");
        } else {
            next();
        }
    });*/
    app.use(function(req, res, next) {
        var user = auth(req);
        if(!user) {
            res.set("WWW-Authenticate", "Basic");
            res.status(401).end();
        } else {
            req.user = user;
            next();
        }
    });
    var buildHttpOptions = function(host, port, basicAuth, pathTemplate, params) {
        params.colon = ":";
        params.colon1 = ":";
        params.colon2 = ":";
        params.colon3 = ":";
        params.colon5 = ":";
        console.log(eut(pathTemplate, params)); 
        return {
            host: host,
            port: port,
            headers: {
                "Authorization": basicAuth
            },
            path: eut(pathTemplate, params)
        };
    };
    var buildE3SHttpOptions = function(basicAuth, pathTemplate, params) {
        return buildHttpOptions('e3s.epam.com', 443, basicAuth, pathTemplate, params);
    }
    var sendHttps = function(options, successCallback, errorCallback) {
        https.get(options, function(resp) {
            var body = "";
            resp.on('data', function(chunk) {
                body += chunk;
            });
            resp.on('end', function() {
                successCallback(body);
            });
        }).on("error", function(e) {
            errorCallback(e);
        });
    };
    var sendE3SHttps = function(basicAuth, pathTemplate, params, successCallback, errorCallback) {
        var options = buildE3SHttpOptions(basicAuth, pathTemplate, params);
        sendHttps(options, successCallback, errorCallback);
    };
    var proxyE3SReq = function(req, res, pathTemplate, params, successCallback, errorCallback){
        sendE3SHttps(req.headers.authorization, pathTemplate, params, successCallback || function(body) {
            res.set("Content-type", "application/json");
            res.status(200).send(body);
        }, errorCallback || function(e) {
            res.status(500).send(e);
        });
    };    
    app.get('(/api)?/employee', function(req, res) {
        proxyE3SReq(req, res, '/rest/e3s-eco-scripting-impl/0.1.0/data/select?type=com.epam.e3s.app.people.api.data.EmployeeEntity&fields=projectall,fullNameSum,upsaidSum&query={%22email%22:colon%22:email%22}', {
            "email": req.user.name
        });
    });
    app.get('(/api)?/project', function(req, res) {
        proxyE3SReq(req, res, '/rest/e3s-eco-scripting-impl/0.1.0/data/select?type=com.epam.e3s.app.project.api.data.ProjectProjectionEntity&query={%22name%22:colon%22:query%22}&fields=teamUpsaIds', {
            query: req.query.name
        }, function(body) {
            var items = JSON.parse(body)[0].teamUpsaIds;
            proxyE3SReq(req, res, '/rest/e3s-eco-scripting-impl/0.1.0/data/select?type=com.epam.e3s.app.people.api.data.EmployeeEntity&query={%22upsaidSum%22:colon{%22$in%22:colon1:teamUpsaIds}}&fields=fullNameSum,upsaidSum&limit=100', {
                teamUpsaIds: JSON.stringify(items)
            });
        });
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