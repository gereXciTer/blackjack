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
    'click a.estimate': 'estimateStory',
    'change label.card': 'makeVote'
  },
  attach: function(args){
    this.constructor.__super__.attach.apply(this, arguments);
    if(this.model.get('active')){
      Chaplin.mediator.publish('vote:refresh', {storyId: this.model.get('_id'), view: this});
    }
  },
  updateStory: function(params){
    var _this = this;
    this.model.urlRoot = '/api/stories';
    Chaplin.mediator.publish('loader:show');
    this.model.save(params, {
      success: function(){
        _this.collection.fetch();
      }
    });  
  },
	activateStory: function(e){
  	e.preventDefault();
    this.updateStory({active: true, id: this.model.get('_id')});
	},
  revealStory: function(e){
  	e.preventDefault();
    var revealed = !this.model.get('revealed');
    this.updateStory({active: true, revealed: revealed, id: this.model.get('_id')});
  },
  estimateStory: function(e){
  	e.preventDefault();
    this.updateStory({active: false, revealed: true, estimate: $('#storyEstimate').val(), id: this.model.get('_id')});
  },
  makeVote: function(e){
    var formData = this.$el.find('.cards').serializeObject();

    Chaplin.mediator.publish('vote:add', {estimate: formData.estimate, storyId: this.model.get('_id'), view: this, callback: function(){
      Chaplin.mediator.publish('loader:hide');
    }});
  }
});
