/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-09
* Time: 11:34 PM
* To change this template use Tools | Templates.
*/

var Controller = require('controllers/base/controller');
var Model = require('models/base/model');

var HeaderView = require('views/home/header-view');
var DeskView = require('views/desk/desk-view');

module.exports = Controller.extend({

  viewdesk: function(params){
    this.reuse('header', HeaderView, {region: 'header'});
    
    this.view = new DeskView({region: 'main'});
    var deskModel = new Model();

    
  }
  
});
