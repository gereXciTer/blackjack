/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-09
* Time: 11:34 PM
* To change this template use Tools | Templates.
*/

var Controller = require('controllers/base/controller');
var Model = require('models/base/model');

var DeskModel = require('models/desk');

var HeaderView = require('views/home/header-view');
var DeskView = require('views/desk/desk-view');

var DecksCollection = require('models/decks');

module.exports = Controller.extend({

  viewdesk: function(params){
    this.reuse('header', HeaderView, {region: 'header'});
    
    var _this = this;
    
    var deskModel = new DeskModel({id: params.id});
    
    var showDesk = function(model){
      model.set('cards', DecksCollection.at(model.get('deck')).get('cards'));
      _this.view = new DeskView({
        region: 'main',
        model: model
      });
    };
    
    deskModel.fetch({
      success: showDesk
    });

    
  }
  
});
