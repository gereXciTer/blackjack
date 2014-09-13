/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-13
* Time: 08:16 PM
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
    var deskId = this.options.deskId;
    var rootUrl = '/api/desks/';
    var url = rootUrl + deskId + '/users';
    return url;
  }
});