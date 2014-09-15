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
    img: 'title.png',
    cover: 'cover.png',
    name: 'Fibonacci',
    description: 'A typical deck has cards showing the Fibonacci sequence including a zero: 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89',
    path: '0/',
    cards: [
      {
        img: '0.png',
        value: 0
      },
      {
        img: '1.png',
        value: 1
     	},
      {
        img: '2.png',
        value: 2
      },
      {
        img: '3.png',
        value: 3
      },
      {
        img: '5.png',
        value: 5
      },
      {
        img: '8.png',
        value: 8
      },
      {
        img: '13.png',
        value: 13
      },
      {
        img: '21.png',
        value: 21
      },
      {
        img: '34.png',
        value: 34
      },
      {
        img: '55.png',
        value: 55
      },
      {
        img: '89.png',
        value: 89
      }
    ]
  },
  {
    img: 'title.png',
    cover: 'cover.png',
    name: 'Playing cards',
    description: 'Standard playing cards of Ace, 2, 3, 5, 8 and King',
    path: '1/',
    cards: [
      {
        img: 'ace.png',
        value: 1
      },
      {
        img: '2.png',
        value: 2
      },
      {
        img: '3.png',
        value: 3
      },
      {
        img: '5.png',
        value: 5
      },
      {
        img: '8.png',
        value: 8
      },
      {
        img: 'king.png',
        value: 13
      }
    ]
  },
  {
    img: 'title.png',
    cover: 'cover.png',
    name: 'Mountain goat',
    description: '0, ½, 1, 2, 3, 5, 8, 13, 20, 40, 100, and optionally a ? (unsure) and a coffee cup (I need a break)',
    path: '2/',
    cards: [
      {
        img: 'question.png',
        value: 'question'
      },
      {
        img: '0.png',
        value: 0
      },
      {
        img: '0.5.png',
        value: 0.5
      },
      {
        img: '1.png',
        value: 1
      },
      {
        img: '2.png',
        value: 2
      },
      {
        img: '3.png',
        value: 3
      },
      {
        img: '5.png',
        value: 5
      },
      {
        img: '8.png',
        value: 8
      },
      {
        img: '13.png',
        value: 13
      },
      {
        img: '20.png',
        value: 20
      },
      {
        img: '40.png',
        value: 40
      },
      {
        img: '100.png',
        value: 100
      },
      {
        img: 'coffee.png',
        value: 'coffee'
      }
    ]
  }
]);