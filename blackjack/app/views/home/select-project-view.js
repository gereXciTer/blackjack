/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-09
* Time: 06:44 PM
* To change this template use Tools | Templates.
*/

var View = require('views/base/view');
var Model = require('models/base/model');

var SelectParticipantsView = require('views/home/select-participants-view');

module.exports = View.extend({
  autoRender: true,
  className: 'projects step2',
  template: require('./templates/select-project'),
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
    var userModel = new Model();
    var _this = this;
            
    userModel.fetch({
      type: 'GET',
      dataType: 'json',
      timeout: 10000,
      url: 'https://lesson-pizza.codio.io:9500/api/project',
      data: {
        name: _this.$el.find('#selectedProject').val()
      },
      success: function(data){
        
//         console.log(data.attributes)
        
        _this.$el.addClass('dimmed');

        var slides = _this.params.parentView.$el.find('.steps');
        var leftOffset = 0;
        slides.find('#step3').prevAll().each(function(index, el){
          leftOffset += $(el).width();
        });
        slides.css({left: '-' + leftOffset + 'px'});

        _this.params.parentView.subview('step3', new SelectParticipantsView({
          region: 'step3',
          parentView: _this.params.parentView,
          model: new Model({participants: data.attributes})
        }));
        
      },
      error: function(){
        console.log('error fetching data');
      }
    });

    
  },
  goBack: function(e){
		e.preventDefault();
    
    var slides = this.params.parentView.$el.find('.steps');
    var leftOffset = 0;
    slides.find('#step1').prevAll().each(function(index, el){
      leftOffset += $(el).width();
    });
    slides.css({left: '-' + leftOffset + 'px'});

    this.params.parentView.$el.find('.step1').removeClass('dimmed');
    
    this.params.parentView.removeSubview('step4');
    this.params.parentView.removeSubview('step3');
    this.params.parentView.removeSubview('step2');
  }
});
