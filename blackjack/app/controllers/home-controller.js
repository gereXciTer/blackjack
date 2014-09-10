var Controller = require('controllers/base/controller');
var Model = require('models/base/model');

var HeaderView = require('views/home/header-view');
var HomePageView = require('views/home/home-page-view');
var NewDeskView = require('views/home/new-desk-view');

var LoginView = require('views/home/login-view');

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
    
    this.view.subview('step1', new LoginView({
      region: 'step1',
      parentView: this.view
    }));
  }
});
