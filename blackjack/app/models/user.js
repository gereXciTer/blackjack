/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-10
* Time: 11:20 PM
* To change this template use Tools | Templates.
*/

var Model = require('models/base/model');

module.exports = Model.extend({
	defaults: {},
	url: '/api/employee',
  type: 'GET',
  dataType: 'json'
});