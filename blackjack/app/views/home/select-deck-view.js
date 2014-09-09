/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-09
* Time: 07:13 PM
* To change this template use Tools | Templates.
*/

var View = require('views/base/view');

module.exports = View.extend({
  autoRender: true,
  className: 'decks step4',
  template: require('./templates/select-deck'),
  events: {
    'click a.next': 'goNext',
    'click a.back': 'goBack'
  },
  initialize: function(args){
    this.constructor.__super__.initialize.apply(this, arguments);
    this.params = args;
  },
  goNext: function(e){
		e.preventDefault();
    Chaplin.utils.redirectTo('desk#viewdesk', {id: 2})
  },
  goBack: function(e){
		e.preventDefault();    
    
    var slides = this.params.parentView.$el.find('.steps');
    var leftOffset = 0;
    slides.find('#step3').prevAll().each(function(index, el){
      leftOffset += $(el).width();
    });
    slides.css({left: '-' + leftOffset + 'px'});

    this.params.parentView.$el.find('.step3').removeClass('dimmed');
    
    this.params.parentView.removeSubview('step4');
  }
});
