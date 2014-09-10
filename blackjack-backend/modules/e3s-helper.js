/**
 * Created with blackjack.
 * User: alexzad
 * Date: 2014-09-10
 * Time: 02:40 PM
 * To change this template use Tools | Templates.
 */
var httpsHelper = require('./http-helper.js');
exports.buildE3SHttpOptions = function(basicAuth, pathTemplate, params) {
    return httpsHelper.buildHttpOptions('e3s.epam.com', 443, basicAuth, pathTemplate, params);
};
exports.sendE3SHttps = function(basicAuth, pathTemplate, params, successCallback, errorCallback) {
    var options = exports.buildE3SHttpOptions(basicAuth, pathTemplate, params);
    httpsHelper.sendHttps(options, successCallback, errorCallback);
};
exports.proxyE3SReq = function(req, res, pathTemplate, params, successCallback, errorCallback) {
    exports.sendE3SHttps(req.headers.authorization, pathTemplate, params, successCallback || function(body) {
        res.set("Content-type", "application/json");
        res.status(200).send(body);
    }, errorCallback || function(e) {
        res.status(500).send(e);
    });
};