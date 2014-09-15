/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-09
* Time: 07:11 PM
* To change this template use Tools | Templates.
*/

var View = require('views/base/view');

var SelectDeckView = require('views/home/select-deck-view');
var DecksCollection = require('models/decks');
var Model = require('models/base/model');

module.exports = View.extend({
  autoRender: true,
  className: 'participants step3',
  template: require('./templates/select-participants'),
  events: {
    'click a.next': 'goNext',
    'click a.back': 'goBack',
    'click a.add-guest': 'addGuest'
  },
  initialize: function(args){
    this.constructor.__super__.initialize.apply(this, arguments);
    this.params = args;
  },
  goNext: function(e){
		e.preventDefault();    
    
    Chaplin.mediator.publish('deskWizardGoForward', {
      step:4, 
      model: new Model({ decks: DecksCollection}),
      el:  this.$el,
      view: SelectDeckView
    });
  },
 
  goBack: function(e){
		e.preventDefault();
    Chaplin.mediator.publish('deskWizardGoBack', 2);
  },
  
  addGuest: function(e){
    e.preventDefault();    
    var target = $(e.currentTarget);
    target.siblings('ul').append('<li><input type="text" name="guest" placeholder="Enter email to invite guest" /></li>');
    target.siblings('ul').find('input[type="text"]:last').focus();
  }
});
