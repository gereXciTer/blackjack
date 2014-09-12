var SiteView = require('views/site-view');

module.exports = Chaplin.Controller.extend({
  // Compositions persist stuff between controllers.
  // You may also persist models etc.
  beforeAction: function() {
    if(Application.pollers){
      for(var i = 0; i < Application.pollers.length; i++){
        if(Application.pollers[i].poller.stop){
		    	Application.pollers[i].poller.stop();
        }
      }
    }else{
      Application.pollers = [];
    }

    Chaplin.mediator.publish('loader:show');
    return this.reuse('site', SiteView);
  }
});
