/**
 * Created with blackjack.
 * User: alexzad
 * Date: 2014-09-10
 * Time: 02:25 PM
 * To change this template use Tools | Templates.
 */
exports.basic = function(req, res, next) {
		var auth = require('basic-auth');
    var user = auth(req);
    if(!user) {
    		console.log("not authenticated, responding with 401");
        res.set("WWW-Authenticate", "Basic realm=\"blackjack\"");
        res.status(401).end();
    } else {
    		console.log("authenticated as " + user.name);
        req.user = user;
        next();
    }
};