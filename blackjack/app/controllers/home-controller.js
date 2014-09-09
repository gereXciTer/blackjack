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
    var userModel = new Model();

//     userModel.fetch({
//       type: 'GET',
//       dataType: 'jsonp',
//       timeout: 10000,
//       url: 'https://e3s.epam.com/rest/e3s-eco-scripting-impl/0.1.0/data/select?type=com.epam.e3s.app.people.api.data.EmployeeEntity&query={%22email%22:%22volodymyr_hartsev@epam.com%22}&fields=fullNameSum.full,project',
//       success: function(data){
//         console.log(data);
//       },
//       error: function(){
//         console.log('error fetching data');
//       }
//     });
    
    this.view.subview('step1', new LoginView({
      region: 'step1',
      parentView: this.view
    }));
  }
});
