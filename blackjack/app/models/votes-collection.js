/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-12
* Time: 03:01 AM
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
    var rootUrl = '/api/votes/';
    var query = '?query=' + JSON.stringify({
      "storyId": this.options.storyId
    });
    var url = rootUrl + query;
    return url;
  }
});