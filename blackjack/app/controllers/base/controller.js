var SiteView = require('views/site-view');

module.exports = Chaplin.Controller.extend({
  // Compositions persist stuff between controllers.
  // You may also persist models etc.
  beforeAction: function() {
    if(Application.pollers){
      for(var i = 0; i < Application.pollers.length; i++){
        if(Application.pollers[i].stop){
		    	Application.pollers[i].stop();
        }
      }
    }else{
      Application.pollers = [];
    }

    Chaplin.mediator.publish('loader:show');
    return this.reuse('site', SiteView);
  }
});
