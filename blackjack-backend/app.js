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
    app.use(auth.basic);
    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    console.log("http basic auth enabled");
    var e3sController = require('./controllers/e3s.js').init(app);
    console.log("e3s controller initialized");
    var deskController = require('./controllers/desk.js').init(app);
    console.log("desk controller initialized");
    app.listen(3334);
    console.log("listening on :3334");
}());