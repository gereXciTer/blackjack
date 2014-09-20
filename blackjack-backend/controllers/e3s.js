/**
 * Created with blackjack.
 * User: alexzad
 * Date: 2014-09-10
 * Time: 11:41 PM
 * To change this template use Tools | Templates.
 */
exports.init = function(app, mongoose) {
    var e3s = require('./../modules/e3s-helper.js')
    app.get('(/api)?/employee', function(req, res) {
        res.set("Content-type", "application/json");
        res.status(200).send([req.user.profile]);
    });
    app.get('(/api)?/project', function(req, res) {
        e3s.sendE3SHttps(req.headers.authorization, '/rest/e3s-eco-scripting-impl/0.1.0/data/searchFts?type=com.epam.e3s.app.people.api.data.EmployeeEntity&query={%22statements%22:colon[{%22query%22:colon1%22project:colon2(:query)%22}],%22limit%22:colon3100}&fields=photosSum,fullNameSum,upsaidSum,emailSum', {
            query: req.query.name
        }, function(body) {
            console.log("returning people for project: " + body);
            res.set("Content-type", "application/json");
            res.status(200).send(JSON.parse(body).map(function(item) {
                return item.data;
            }));
        });
    });
    console.log("e3s controller initialized");
};