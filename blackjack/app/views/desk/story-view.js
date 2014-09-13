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
    votes: '.votes'
  },
  events: {
    'click a.activate': 'activateStory',
    'click a.reveal': 'revealStory',
    'change label.card': 'makeVote'
  },
  initialize: function(args){
    this.constructor.__super__.initialize.apply(this, arguments);
    if(this.model.get('active')){
	    Chaplin.mediator.publish('vote:refresh', {storyId: this.model.get('_id'), view: this});
    }
  },                            
	activateStory: function(e){
    var _this = this;
  	e.preventDefault();
    this.model.urlRoot = '/api/stories';
    Chaplin.mediator.publish('loader:show');
    this.model.save({active: true, id: this.model.get('_id')}, {
      success: function(){
      	Chaplin.mediator.publish('story:refresh', _this.collection);
      }
    });  
	},
  revealStory: function(e){
    var _this = this;
  	e.preventDefault();
    this.model.urlRoot = '/api/stories';
    Chaplin.mediator.publish('loader:show');
    this.model.save({active: true, revealed: !this.model.get('revealed'), id: this.model.get('_id')}, {
      success: function(){
      	Chaplin.mediator.publish('story:refresh', _this.collection);
      }
    });  
  },
  makeVote: function(e){
    var formData = this.$el.find('.cards').serializeObject();

    Chaplin.mediator.publish('vote:add', {estimate: formData.estimate, storyId: this.model.get('_id'), view: this});
  }
});
