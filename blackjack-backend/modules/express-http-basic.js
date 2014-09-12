/**
 * Created with blackjack.
 * User: alexzad
 * Date: 2014-09-10
 * Time: 02:25 PM
 * To change this template use Tools | Templates.
 */
var e3s = require('./../modules/e3s-helper.js')
var NodeCache = require("node-cache");
var myCache = new NodeCache({
    stdTTL: 3600,
    checkperiod: 60
});
var md5 = require('MD5');
exports.basic = function(req, res, next) {
    var auth = require('basic-auth');
    var user = auth(req);
    if(!user) {
        console.log("not authenticated, responding with 401");
        res.set("WWW-Authenticate", "Basic realm=\"blackjack\"");
        res.status(401).end();
    } else {
        console.log("provided credentials for: " + user.name);
        var hash = md5("!salt1234" + req.headers.authorization);
        console.log("checking auth cache for key: " + hash);
        var cached = myCache.get(hash);
        if(!Object.keys(cached).length) {
            console.log("nothing in auth cache, going to e3s to authenticate");
            skipAuth(req.headers.authorization, '/rest/e3s-eco-scripting-impl/0.1.0/data/select?type=com.epam.e3s.app.people.api.data.EmployeeEntity&fields=projectall,fullNameSum,upsaidSum,emailSum&query={%22email%22:colon%22:email%22}', {
                "email": user.name
            }, function(body) {
                console.log("authentication ok for: " + user.name);
                console.log("deleting password before storing the object");
                delete user["pass"];
                console.log("user object with no password: " + JSON.stringify(user));
                req.user = user;
                req.user.profile = body;
                console.log("caching key: " + hash + ", user: " + JSON.stringify(req.user));
                myCache.set(hash, req.user);
                next();
            }, function(err) {
                console.log("authentication failed for " + user.name);
                console.log("purging cache key: " + hash);
                myCache.del(hash);
                res.status(403).send({
                    errorCode: 403,
                    errorMessage: "Provided credentials are not valid",
                    innerError: err
                });
            });
        } else {
            console.log("item " + JSON.stringify(cached) + " found in auth cache, returning cached");
            req.user = cached[hash];
            next();
        }
    }
};

function skipAuth(auth, urlTemplate, params, success, error) {
    error({
        dummy: true
    });
}