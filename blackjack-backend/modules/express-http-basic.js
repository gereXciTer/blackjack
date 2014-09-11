/**
 * Created with blackjack.
 * User: alexzad
 * Date: 2014-09-10
 * Time: 02:25 PM
 * To change this template use Tools | Templates.
 */
var e3s = require('./../modules/e3s-helper.js')
exports.basic = function(req, res, next) {
    var auth = require('basic-auth');
    var user = auth(req);
    if(!user) {
        console.log("not authenticated, responding with 401");
        res.set("WWW-Authenticate", "Basic realm=\"blackjack\"");
        res.status(401).end();
    } else {
        console.log("provided credentials for " + user.name);
        req.user = user;
        e3s.sendE3SHttps(req.headers.authorization, '/rest/e3s-eco-scripting-impl/0.1.0/data/select?type=com.epam.e3s.app.people.api.data.EmployeeEntity&fields=projectall,fullNameSum,upsaidSum,emailSum&query={%22email%22:colon%22:email%22}', {
            "email": req.user.name
        }, function(body) {
            console.log("authentication ok for " + req.user.name);
            req.user.profile = JSON.parse(body);
            next();
        }, function(err) {
            console.log("authentication failed for " + req.user.name);
            res.status(403).send({
                errorCode: 403,
                errorMessage: "Provided credentials are not valid",
                innerError: err
            });
        });
    }
};