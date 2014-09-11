/**
 * Created with blackjack.
 * User: alexzad
 * Date: 2014-09-10
 * Time: 11:41 PM
 * To change this template use Tools | Templates.
 */
exports.init = function(app) {
    var e3s = require('./../modules/e3s-helper.js')
    app.get('(/api)?/employee', function(req, res) {
        e3s.proxyE3SReq(req, res, '/rest/e3s-eco-scripting-impl/0.1.0/data/select?type=com.epam.e3s.app.people.api.data.EmployeeEntity&fields=projectall,fullNameSum,upsaidSum,emailSum&query={%22email%22:colon%22:email%22}', {
            "email": req.user.name
        });
    });
    app.get('(/api)?/project', function(req, res) {
        e3s.proxyE3SReq(req, res, '/rest/e3s-eco-scripting-impl/0.1.0/data/select?type=com.epam.e3s.app.project.api.data.ProjectProjectionEntity&query={%22name%22:colon%22:query%22}&fields=teamUpsaIds', {
            query: req.query.name
        }, function(body) {
            var items = JSON.parse(body)[0].teamUpsaIds;
            e3s.proxyE3SReq(req, res, '/rest/e3s-eco-scripting-impl/0.1.0/data/select?type=com.epam.e3s.app.people.api.data.EmployeeEntity&query={%22upsaidSum%22:colon{%22$in%22:colon1:teamUpsaIds}}&fields=fullNameSum,upsaidSum,emailSum&limit=100', {
                teamUpsaIds: JSON.stringify(items)
            });
        });
    });
};