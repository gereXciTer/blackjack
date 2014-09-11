/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-11
* Time: 05:56 PM
* To change this template use Tools | Templates.
*/

var View = require('views/base/view');

module.exports = View.extend({
  autoRender: true,
  className: 'error404',
  template: require('./templates/error404')
});
