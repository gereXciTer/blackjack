var utils = require('./utils');
var DecksCollection = require('models/decks');

var register = function(name, fn) {
  return Handlebars.registerHelper(name, fn);
};

register('with', function(context, options) {
  if (!context || Handlebars.Utils.isEmpty(context)) {
    return options.inverse(this);
  } else {
    return options.fn(context);
  }
});

register('without', function(context, options) {
  var inverse = options.inverse;
  options.inverse = options.fn;
  options.fn = inverse;
  return Handlebars.helpers['with'].call(this, context, options);
});

register('url', function(routeName) {
  var params = [].slice.call(arguments, 1);
  var options = params.pop();
  return utils.reverse(routeName, params);
});

register('cardimg', function(estimate) {
  var deck = DecksCollection.at(Application.desk.deck);
  var card = _.find(deck.get('cards'), function(cardItem){
    return cardItem.value == estimate;
  });
  return deck.get('path') + card.img;
});

register('cardcover', function() {
  var deck = DecksCollection.at(Application.desk.deck);
  return deck.get('path') + deck.get('cover');
});

register('isowner', function(options) {
  if(Application.desk.isOwner) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

register('compare', function(lvalue, rvalue, options) {

    if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

    operator = options.hash.operator || "==";

    var operators = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; }
    }

    if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

    var result = operators[operator](lvalue,rvalue);

    if( result ) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});
