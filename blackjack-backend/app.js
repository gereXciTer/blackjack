/**
* Created with blackjack.
* User: alexzad
* Date: 2014-09-09
* Time: 02:29 PM
*/
(function () {
    
    var express = require('express');
    var app = express();

    var mongoose = require('mongoose');	
    mongoose.connect('mongodb://blackjackapp:pAssword1!@ds035740.mongolab.com:35740/blackjack');
    
    var Room = mongoose.model('Room', { name: String });
    
    app.get('/rooms', function(req, res){
        var filter = JSON.parse(req.query.query);
        var query  = Room.where(filter);

        query.find(function (err, rooms) {
            if (err) {
                res.set(500).send(err);
            }
            else {
                res.set("Content-type", "application/json");
                res.status(200).send(rooms);
            }
    	});
    });
    
    app.get('/rooms/:id', function(req, res){
        var query  = Room.where({ _id: req.params.id });
        
        query.findOne(function (err, room) {
            if (err) {
                res.set(500).send(err);
            }
            else {
                res.set("Content-type", "application/json");
                res.status(200).send(room);
            }
        });
    });
    
    // to be POST
    app.get('/rooms_add', function(req, res){
        var room = new Room({ name: req.query.name });
        
        room.save(function (err) {
        	if (err) {
                res.status(500).send(err);              
        	}
            else {
                res.set("Link", "</rooms/" + room._id + ">; rel=\"created-resource\"");
                res.status(201).send("created");
            }
        });
    });

    app.listen(3334);
    
}());