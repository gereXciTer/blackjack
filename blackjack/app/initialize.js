var Application = require('application');
var routes = require('routes');

$.fn.serializeObject = function()
{
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};
Application.pollerConfig = {
  frequencies: {
    'story': 500000,
    'vote': 150000,
    'online': 5000
  },
  getFreq: function(name){
    return this.frequencies[name] || 5000;
  }
};
$(function() {
  return new Application({
    title: 'Brunch example application',
    controllerSuffix: '-controller',
    routes: routes
  });
});
