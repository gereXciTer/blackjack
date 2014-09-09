/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-09
* Time: 06:32 PM
* To change this template use Tools | Templates.
*/

var View = require('views/base/view');

var SelectProjectView = require('views/home/select-project-view');

module.exports = View.extend({
  autoRender: true,
  className: 'login step1',
  template: require('./templates/login'),
  events: {
    'click a.next': 'goNext'
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
    slides.find('#step2').prevAll().each(function(index, el){
      leftOffset += $(el).width();
    });
    slides.css({left: '-' + leftOffset + 'px'});
    
    this.params.parentView.subview('step2', new SelectProjectView({
      region: 'step2',
      parentView: this.params.parentView
    }));
  }
});
