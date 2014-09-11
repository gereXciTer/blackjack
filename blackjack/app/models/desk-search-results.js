/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-11
* Time: 06:04 PM
* To change this template use Tools | Templates.
*/

var Collection  = require('models/base/collection');

module.exports = Collection.extend({
	defaults: {},
  initialize: function(options) {
    options || (options = {});
    this.options = options;
  },
  url: function(){
    console.log(this);
    var term = this.options.term;
    var email = Application.userModel.attributes[0].emailSum;
    var rootUrl = '/api/desks/';
//     'query={%22$and%22:[{%22deskName%22:{%22$regex%22:%22search_term.*%22}},{%22$or%22:[{%22participant%22:%22alexey_zadorozhny@epam.com%22},{%22owner%22:%22alexey_zadorozhny@epam.com%22},{%22guest%22:%22alexey_zadorozhny@epam.com%22}]}'
    var query = '?query=' + JSON.stringify({
      "and": [
        {
          "deskName": {"regex": term + ".*"}
        },
        {
          "or": [
            { "participant": email },
            { "owner": email },
            { "guest": email }
          ]
        }
      ]});
    var url = rootUrl + query;
    return url;
  }
});