/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-12
* Time: 03:15 AM
* To change this template use Tools | Templates.
*/

var utils = require('lib/utils');

var Collection = require('models/base/collection');

var CollectionView = require('views/base/collection-view');
var View = require('views/base/view');

module.exports = CollectionView.extend({
	itemView: View.extend({
    autoRender: true,
    tagName : 'li',
    className: 'vote',
    template: require('./templates/vote'),
    attach: function(args){
      this.constructor.__super__.attach.apply(this, arguments);
    },
  }),
  animationDuration: 0,
	autoRender: true,
	className: 'stories-list-wrapper',
  tagName : 'ul',
	className: 'votes-list',
  initialize: function(attrs){
    this.options = attrs; 
  },
	attach: function() {
		this.constructor.__super__.attach.apply(this, arguments);
	}
});