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
      timeout: 30000,
      url: 'https://lesson-pizza.codio.io:9500/api/employee',
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
      error: function(xhr, status){
        console.log(status.statusText);
        Chaplin.utils.redirectTo('home#index');
      }
    });
		
    Chaplin.mediator.unsubscribe('deskWizardGoBack');
    Chaplin.mediator.subscribe('deskWizardGoBack',function(step){
      var slides = _this.view.$el.find('.steps');
      var leftOffset = 0;
      slides.find('#step' + step).prevAll().each(function(index, el){
        leftOffset += $(el).width();
      });
      slides.css({left: '-' + leftOffset + 'px'});
      _this.view.$el.find('.step' + step).removeClass('dimmed');

      _this.view.$el.find('#step' + step).nextAll('li').each(function(index, el){
        _this.view.removeSubview(el.id);
      });
    });
    
    Chaplin.mediator.unsubscribe('deskWizardGoForward');
    Chaplin.mediator.subscribe('deskWizardGoForward',function(params){
      var step = params.step;
      
      params.el.addClass('dimmed');

      var slides = _this.view.$el.find('.steps');
      var leftOffset = 0;
      slides.find('#step' + step).prevAll().each(function(index, el){
        leftOffset += $(el).width();
      });
      slides.css({left: '-' + leftOffset + 'px'});

      _this.view.subview('step' + step, new params.view({
        region: 'step' + step,
        parentView: _this.view,
        model: params.model
      }));
    });
    

  }
});
