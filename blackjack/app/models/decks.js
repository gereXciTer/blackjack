/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-11
* Time: 03:29 AM
* To change this template use Tools | Templates.
*/

var Collection  = require('models/base/collection');

module.exports = new Collection([
  {
    cards: [
      {
        img: '0/0.jpg',
        value: 1
      },
      {
        img: '0/1.jpg',
        value: 2
     	},
      {
        img: '0/2.jpg',
        value: 3
      },
      {
        img: '0/3.jpg',
        value: 5
      },
      {
        img: '0/4.jpg',
        value: 8
      },
      {
        img: '0/5.jpg',
        value: 13
      }
    ]
  },
  {
    cards: [
      {
        img: '1/0.jpg',
        value: 1
      },
      {
        img: '1/1.jpg',
        value: 2
      },
      {
        img: '1/2.jpg',
        value: 3
      },
      {
        img: '1/3.jpg',
        value: 5
      }
    ]
  },
  {
    cards: [
      {
        img: '2/0.jpg',
        value: 1
      },
      {
        img: '2/1.jpg',
        value: 2
      },
      {
        img: '2/2.jpg',
        value: 3
      },
      {
        img: '2/3.jpg',
        value: 5
      }
    ]
  }
]);