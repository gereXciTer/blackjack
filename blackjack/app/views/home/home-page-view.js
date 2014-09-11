var View = require('views/base/view');

module.exports = View.extend({
  autoRender: true,
  className: 'home-page',
  template: require('./templates/home'),
  regions: {
    searchresults: "#desksSearchResult"
  },
  events: {
    'keyup #desksSearch': 'autoComplete'
  },
  autoComplete: function(e){
    Chaplin.mediator.publish('desksSearch', $(e.currentTarget));
  }
});
