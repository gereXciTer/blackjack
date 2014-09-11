/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-09
* Time: 07:13 PM
* To change this template use Tools | Templates.
*/

var View = require('views/base/view');

module.exports = View.extend({
  autoRender: true,
  className: 'decks step4',
  template: require('./templates/select-deck'),
  events: {
    'click a.next': 'goNext',
    'click a.back': 'goBack'
  },
  initialize: function(args){
    this.constructor.__super__.initialize.apply(this, arguments);
    this.params = args;
  },
  goNext: function(e){
    var _this = this;
		e.preventDefault();
    var formData = $('#newDeskForm').serializeObject();
    if(!_.isArray(formData.participant)){
      formData.participant = [formData.participant];
    }
    formData.participant = _.map(formData.participant, function(item){
      var user = _.find(_this.params.parentView.subview('step3').model.get('participants'), function(el){ return el.emailSum == item; });
      item = {
        email: item,
        name: user.fullNameSum.full
      };
      return item;
    });

    if(!formData.deskName){
      $('#deskName').addClass('error');
    }else{
      $.ajax({
        type: 'POST',
        url:'/api/desks/',
        data: JSON.stringify(formData),
        contentType: "application/json; charset=utf-8",
        success: function(data){
			    Chaplin.utils.redirectTo('desk#viewdesk', {id: data.deskId});
        },
        error: function(){
          console.log('New desk saving error');
        }
      });
    }
  },
  goBack: function(e){
		e.preventDefault();
    Chaplin.mediator.publish('deskWizardGoBack', 3);
  },
});
