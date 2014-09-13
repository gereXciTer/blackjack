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
    var term = this.options.term;
    var email = Application.userModel.attributes[0] ? Application.userModel.attributes[0].emailSum : '';
    var rootUrl = '/api/desks/';
    var queryObj = {
      "$and": [
        {
          "deskName": {"$regex": term + "", "$options":"i"}
        }
      ]};
    if(email){
      queryObj.$and.push({
          "$or": [
            { "owner": email },
            { "participant.email": email },
            { "guest.email": email }
          ]
        });
    }
    var query = '?query=' + JSON.stringify(queryObj);
    var url = rootUrl + query;
    return url;
  }
});