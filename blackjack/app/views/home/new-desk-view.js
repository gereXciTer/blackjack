/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-09
* Time: 06:25 PM
* To change this template use Tools | Templates.
*/

var View = require('views/base/view');

module.exports = View.extend({
  autoRender: true,
  className: 'new-desk',
  template: require('./templates/new-desk'),
  regions: {
    step1: '#step1',
    step2: '#step2',
    step3: '#step3',
    step4: '#step4'
  }
});
