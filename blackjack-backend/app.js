/**
 * Created with blackjack.
 * User: alexzad
 * Date: 2014-09-09
 * Time: 02:29 PM
 */
(function() {
    var express = require('express');
    var app = express();
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://blackjackapp:pAssword1!@ds035740.mongolab.com:35740/blackjack');
    console.log("db connection established");
    var auth = require('./modules/express-http-basic.js');
    app.use(auth.basic(mongoose));
    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    console.log("http basic auth enabled");
    var e3sController = require('./controllers/e3s.js').init(app, mongoose);
    var deskController = require('./controllers/desk.js').init(app, mongoose);
    var storyController = require('./controllers/story.js').init(app, mongoose);
    var voteController = require('./controllers/vote.js').init(app, mongoose);
    var userController = require('./controllers/user.js').init(app, mongoose);
    app.listen(3334);
    console.log("listening on :3334");
}());