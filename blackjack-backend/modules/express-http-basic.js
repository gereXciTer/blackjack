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
        res.set("WWW-Authenticate", "Basic");
        res.status(401).end();
    } else {
        req.user = user;
        next();
    }
};