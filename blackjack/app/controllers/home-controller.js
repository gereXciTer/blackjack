var Controller = require('controllers/base/controller');
var Model = require('models/base/model');

var HeaderView = require('views/home/header-view');
var HomePageView = require('views/home/home-page-view');
var NewDeskView = require('views/home/new-desk-view');

var LoginView = require('views/home/login-view');
var SelectProjectView = require('views/home/select-project-view');

module.exports = Controller.extend({
  beforeAction: function() {
    this.constructor.__super__.beforeAction.apply(this, arguments);
//     this.reuse('header', HeaderView, {region: 'header'});
  },

  index: function() {
    this.view = new HomePageView({region: 'main'});
  },
  
  newdesk: function(){
    this.reuse('header', HeaderView, {region: 'header'});
    this.view = new NewDeskView({region: 'main'});
    var userModel = new Model();
    var _this = this;
            
    userModel.fetch({
      type: 'GET',
      dataType: 'json',
      timeout: 10000,
      url: 'https://lesson-pizza.codio.io:9500/api/employee/',
      success: function(data){
        var projects = data.attributes[0].projectall.split(' '),
            projarray = [];
        for(var i = 0; i<projects.length; i++){
          projarray.push({name: projects[i]});
        }
        
        _this.view.subview('step2', new SelectProjectView({
          region: 'step2',
          parentView: _this.view,
          model: new Model({projects: projarray})
        }));
        
      },
      error: function(){
        console.log('error fetching data');
      }
    });

  }
});
