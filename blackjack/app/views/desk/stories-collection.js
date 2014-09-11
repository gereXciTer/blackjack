/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-11
* Time: 07:14 PM
* To change this template use Tools | Templates.
*/

var utils = require('lib/utils');

var Collection = require('models/base/collection');

var CollectionView = require('views/base/collection-view');
var ItemView = require('./story-view');

module.exports = CollectionView.extend({
	itemView: ItemView,
	autoRender: true,
	className: 'stories-list-wrapper',
	listSelector: 'ul.stories-list',
	template: require('./templates/stories-list'),
  events: {
    'click #submitNewStory': 'submitNewStory'
  },
  initialize: function(attrs){
    this.options = attrs; 
  },
	attach: function() {
		this.constructor.__super__.attach.apply(this, arguments);
		var _this = this;
	},
  submitNewStory: function(e){
    e.preventDefault();
    Chaplin.mediator.publish('story:add', this.$el.find('#newStory').val());
  }
});