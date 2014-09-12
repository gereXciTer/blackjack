/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-09
* Time: 06:32 PM
* To change this template use Tools | Templates.
*/

var View = require('views/base/view');
var Model = require('models/base/model');
var UserModel = require('models/user');

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
    
    Chaplin.mediator.publish('loader:show');

    var userModel = new UserModel();
    var _this = this;
            
    userModel.fetch({
      success: function(data){
        var projects = data.attributes[0].projectall.split(' '),
            projarray = [];
        for(var i = 0; i<projects.length; i++){
          projarray.push({name: projects[i]});
        }
        
        Chaplin.mediator.publish('deskWizardGoForward', {
          step:2, 
          model: Model({projects: projarray}), 
          el:  _this.$el,
          view: SelectProjectView
        });
        
      },
      error: function(){
        console.log('error fetching data');
      }
    });
    
  }
});
