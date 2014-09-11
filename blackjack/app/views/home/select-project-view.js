/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-09
* Time: 06:44 PM
* To change this template use Tools | Templates.
*/

var View = require('views/base/view');
var Model = require('models/base/model');
var ProjectModel = require('models/project');

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
    var projectModel = new ProjectModel();
    var _this = this;
            
    projectModel.fetch({
      data: {
        name: _this.$el.find('#selectedProject').val()
      },
      success: function(data){
        var participants = [];
        _.each(data.attributes, function(item){
          console.log(Application.userModel.attributes[0].emailSum, item.emailSum);
          if(item.emailSum !== Application.userModel.attributes[0].emailSum){
            participants.push(item);
          }
        });

        Chaplin.mediator.publish('deskWizardGoForward', {
          step:3, 
          model: new Model({participants: participants, owner: Application.userModel.attributes[0].emailSum}), 
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
