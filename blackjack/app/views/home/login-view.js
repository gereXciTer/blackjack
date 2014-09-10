/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-09
* Time: 06:32 PM
* To change this template use Tools | Templates.
*/

var View = require('views/base/view');
var Model = require('models/base/model');

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
    
    var userModel = new Model();
    var _this = this;
            
    userModel.fetch({
      type: 'GET',
      dataType: 'json',
      timeout: 10000,
      data: {email: $('#loginForm input').val()},
      url: 'http://lesson-pizza.codio.io:8080/api/employee/',

//       crossDomain: true,
//       beforeSend: function(xhr) {
//         xhr.setRequestHeader('Authorization', 'Basic dm9sb2R5bXlyX2hhcnRzZXZAZXBhbS5jb206S2FybWlhbjQ3');
//         xhr.setRequestHeader('GET', 'https://e3s.epam.com/search/people HTTP/1.1');
//         xhr.setRequestHeader('Host', 'e3s.epam.com');
//         xhr.setRequestHeader('Authorization', 'Basic YWxleGV5X3phZG9yb3pobnlAZXBhbS5jb206OTg3b2l1S0pIbmJ2');
//       },
//       url: 'https://e3s.epam.com/rest/e3s-eco-scripting-impl/0.1.0/data/select',
      url: 'https://volodymyr_hartsev@epam.com:Karmian47@e3s.epam.com/search/people',
//       data: {
//         type: 'com.epam.e3s.app.people.api.data.EmployeeEntity',
//         query: '{"email":"volodymyr_hartsev@epam.com"}'
//       },
      success: function(data){
        
        _this.$el.addClass('dimmed');

        var slides = _this.params.parentView.$el.find('.steps');
        var leftOffset = 0;
        slides.find('#step2').prevAll().each(function(index, el){
          leftOffset += $(el).width();
        });
        slides.css({left: '-' + leftOffset + 'px'});

        _this.params.parentView.subview('step2', new SelectProjectView({
          region: 'step2',
          parentView: _this.params.parentView,
          model: new Model({projects: [
            {name:'GLO-ODC'},
            {name:'UBS-WMATVLK'},
            {name:'HBO-GOT'}
          ]})
        }));
        
      },
      error: function(){
        console.log('error fetching data');
      }
    });
    
  }
});
