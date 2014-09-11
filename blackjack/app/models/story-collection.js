/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-11
* Time: 07:25 PM
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
    var rootUrl = '/api/stories/';
    var query = '?query=' + JSON.stringify({
      "deskId": this.options.deskId
    });
    var url = rootUrl + query;
    return url;
  }
});