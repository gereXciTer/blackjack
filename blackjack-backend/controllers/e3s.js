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
        e3s.proxyE3SReq(req, res, '/rest/e3s-eco-scripting-impl/0.1.0/data/searchFts?type=com.epam.e3s.app.project.api.data.ProjectProjectionEntity&query={%22statements%22:colon[{%22query%22:colon2%22name:colon3(:query)%22}]}&fields=teamUpsaIds', {
            query: req.query.name
        }, function(body) {
            console.log("received project list");
            var items = JSON.parse(body)[0].data.teamUpsaIds;
            e3s.proxyE3SReq(req, res, '/rest/e3s-eco-scripting-impl/0.1.0/data/select?type=com.epam.e3s.app.people.api.data.EmployeeEntity&query={%22upsaidSum%22:colon{%22$in%22:colon1:teamUpsaIds}}&fields=photosSum,fullNameSum,upsaidSum,emailSum&limit=100', {
                teamUpsaIds: JSON.stringify(items)
            });
        });
    });
    console.log("e3s controller initialized");
};