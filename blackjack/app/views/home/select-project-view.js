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
        
        Chaplin.mediator.publish('deskWizardGoForward', {
          step:3, 
          model: new Model({participants: data.attributes}), 
          el:  _this.$el,
          view: SelectParticipantsView
        });
        
      },
      error: function(){
        console.log('error fetching data');
      }
    });

    
  },
  goBack: function(e){
		e.preventDefault();
    Chaplin.mediator.publish('deskWizardGoBack', 1);
  },
});
