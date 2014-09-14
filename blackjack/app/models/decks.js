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
    cover: '0/cover.png',
    cards: [
      {
        img: '0/0.png',
        value: 1
      },
      {
        img: '0/1.png',
        value: 2
     	},
      {
        img: '0/2.png',
        value: 3
      },
      {
        img: '0/3.png',
        value: 5
      },
      {
        img: '0/4.png',
        value: 8
      },
      {
        img: '0/5.png',
        value: 13
      }
    ]
  },
  {
    cover: '1/cover.png',
    cards: [
      {
        img: '1/0.png',
        value: 1
      },
      {
        img: '1/1.png',
        value: 2
      },
      {
        img: '1/2.png',
        value: 3
      },
      {
        img: '1/3.png',
        value: 5
      }
    ]
  },
  {
    cover: '2/cover.png',
    cards: [
      {
        img: '2/0.png',
        value: 1
      },
      {
        img: '2/1.png',
        value: 2
      },
      {
        img: '2/2.png',
        value: 3
      },
      {
        img: '2/3.png',
        value: 5
      }
    ]
  }
]);