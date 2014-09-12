/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-11
* Time: 11:11 PM
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
		template: require('./templates/search-list'),
  }),
	autoRender: true,
  tagName : 'ul',
	className: 'search-list',
  initialize: function(attrs){
    this.options = attrs; 
  },
	attach: function() {
		this.constructor.__super__.attach.apply(this, arguments);
		var _this = this;
	}
});