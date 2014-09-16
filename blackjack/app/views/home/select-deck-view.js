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
    if(formData.participant && !_.isArray(formData.participant)){
      formData.participant = [formData.participant];
    }
    if(formData.participant){
      formData.participant = _.map(formData.participant, function(item){
        var user = _.find(_this.params.parentView.subview('step3').model.get('participants'), function(el){ return el.emailSum == item; });
        item = {
          email: item,
          name: user.fullNameSum.full,
          photoId: user.photosSum ? user.photosSum[0] : 'dummy'
        };
        return item;
      });
    }else{
      formData.participant = [];
    }
    formData.participant.push({
      email: Application.userModel.attributes[0].emailSum,
      name: Application.userModel.attributes[0].fullNameSum.full,
      photoId: Application.userModel.attributes[0].photosSum[0]
    });

    if(!formData.deskName || formData.deck == undefined){
      if(formData.deck == undefined){
        this.$el.find('.decks').addClass('error');
      }
      if(!formData.deskName){
	      $('#deskName').addClass('error');
      }
    }else {
      $.ajax({
        type: 'POST',
        url:'/api/desks/',
        data: JSON.stringify(formData),
        contentType: "application/json; charset=utf-8",
        success: function(data){
          Chaplin.mediator.publish('loader:show');
			    Chaplin.utils.redirectTo('desk#viewdesk', {id: data.deskId});
        },
        error: function(xhr){
          var error = JSON.parse(xhr.responseText);
          if(error.errorCode == '400'){
            alert(error.errorMessage);
          }else{
	          console.log('New desk saving error');
          }
        }
      });
    }
  },
  goBack: function(e){
		e.preventDefault();
    Chaplin.mediator.publish('deskWizardGoBack', 3);
  },
});
