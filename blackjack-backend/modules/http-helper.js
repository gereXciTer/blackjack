/**
 * Created with blackjack.
 * User: alexzad
 * Date: 2014-09-10
 * Time: 02:39 PM
 * To change this template use Tools | Templates.
 */
var https = require('https');
var eut = require('express-uri-template');
exports.buildHttpOptions = function(host, port, basicAuth, pathTemplate, params) {
    params.colon = ":";
    params.colon1 = ":";
    params.colon2 = ":";
    params.colon3 = ":";
    params.colon5 = ":";
    console.log("sending Authorization " + basicAuth.substring(0, 15) + "[omitted...]");
    return {
        host: host,
        port: port,
        headers: {
            "Authorization": basicAuth
        },
        path: eut(pathTemplate, params)
    };
};
exports.sendHttps = function(options, successCallback, errorCallback) {
    https.get(options, function(resp) {
        if(resp.statusCode != 200) {
            console.log("remote server returned not expected status " + resp.statusCode);
            errorCallback({
                errorCode: 502,
                errorMessage: "remote server returned not expected status " + resp.statusCode
            });
            return;
        }
        var type = resp.headers["content-type"];
        if(!type || type.indexOf("json") == -1) {
            console.log("remote server returned not supported content-type " + type);
            errorCallback({
                errorCode: 502,
                errorMessage: "remote server returned not supported content-type " + type
            });
            return;
        }
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