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
    description: 'A typical deck has cards showing the Fibonacci sequence including a zero: 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89',
    cards: [
      {
        img: '0/0.png',
        value: 0
      },
      {
        img: '0/1.png',
        value: 1
     	},
      {
        img: '0/2.png',
        value: 2
      },
      {
        img: '0/3.png',
        value: 3
      },
      {
        img: '0/4.png',
        value: 5
      },
      {
        img: '0/5.png',
        value: 8
      },
      {
        img: '0/6.png',
        value: 13
      },
      {
        img: '0/7.png',
        value: 21
      },
      {
        img: '0/8.png',
        value: 34
      },
      {
        img: '0/9.png',
        value: 55
      },
      {
        img: '0/10png',
        value: 89
      }
    ]
  },
  {
    cover: '1/cover.png',
    description: 'Standard playing cards of Ace, 2, 3, 5, 8 and King',
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
      },
      {
        img: '1/4.png',
        value: 8
      },
      {
        img: '1/5.png',
        value: 13
      }
    ]
  },
  {
    cover: '2/cover.png',
    description: '0, ½, 1, 2, 3, 5, 8, 13, 20, 40, 100, and optionally a ? (unsure) and a coffee cup (I need a break)',
    cards: [
      {
        img: '2/0.png',
        value: 0
      },
      {
        img: '2/1.png',
        value: 0.5
      },
      {
        img: '2/2.png',
        value: 1
      },
      {
        img: '2/3.png',
        value: 2
      },
      {
        img: '2/4.png',
        value: 3
      },
      {
        img: '2/5.png',
        value: 5
      },
      {
        img: '2/6.png',
        value: 8
      },
      {
        img: '2/7.png',
        value: 13
      },
      {
        img: '2/8.png',
        value: 20
      },
      {
        img: '2/9.png',
        value: 40
      },
      {
        img: '2/10.png',
        value: 100
      },
      {
        img: '2/11.png',
        value: false
      },
      {
        img: '2/12.png',
        value: false
      }
    ]
  }
]);