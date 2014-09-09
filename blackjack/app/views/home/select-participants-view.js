/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-09
* Time: 07:11 PM
* To change this template use Tools | Templates.
*/

var View = require('views/base/view');

var SelectDeckView = require('views/home/select-deck-view');

module.exports = View.extend({
  autoRender: true,
  className: 'participants step3',
  template: require('./templates/select-participants'),
  events: {
    'click a.next': 'goNext',
    'click a.back': 'goBack',
    'click a.add-guest': 'addGuest'
  },
  initialize: function(args){
    this.constructor.__super__.initialize.apply(this, arguments);
    this.params = args;
  },
  goNext: function(e){
		e.preventDefault();    
    this.$el.addClass('dimmed');
    
    var slides = this.params.parentView.$el.find('.steps');
    var leftOffset = 0;
    slides.find('#step4').prevAll().each(function(index, el){
      leftOffset += $(el).width();
    });
    slides.css({left: '-' + leftOffset + 'px'});
    
    this.params.parentView.subview('step4', new SelectDeckView({
      region: 'step4',
      parentView: this.params.parentView
    }));
  },
  goBack: function(e){
		e.preventDefault();    
    
    var slides = this.params.parentView.$el.find('.steps');
    var leftOffset = 0;
    slides.find('#step2').prevAll().each(function(index, el){
      leftOffset += $(el).width();
    });
    slides.css({left: '-' + leftOffset + 'px'});

    this.params.parentView.$el.find('.step2').removeClass('dimmed');
    
    this.params.parentView.removeSubview('step4');
    this.params.parentView.removeSubview('step3');
  },
  addGuest: function(e){
    e.preventDefault();    
    var target = $(e.currentTarget);
    target.siblings('ul').append('<li><input type="text" name="guest[]" placeholder="Enter email to invite guest" /></li>');
  }
});
