/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-09
* Time: 11:36 PM
* To change this template use Tools | Templates.
*/

var View = require('views/base/view');

module.exports = View.extend({
  autoRender: true,
  className: 'new-desk',
  template: require('./templates/desk'),
  regions: {
		
  },
  attach: function(args){
    this.constructor.__super__.attach.apply(this, arguments);
    
  },
});