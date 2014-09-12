/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-11
* Time: 07:18 PM
* To change this template use Tools | Templates.
*/

var View = require('views/base/view');

module.exports = View.extend({
  autoRender: true,
  tagName: 'li',
  className: 'story',
  template: require('./templates/story'),
  regions: {
    cards: '.cards'
  },
  attach: function(args){
    this.constructor.__super__.attach.apply(this, arguments);
  },
});
