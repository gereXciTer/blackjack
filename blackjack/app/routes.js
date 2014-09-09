// Application routes.
module.exports = function(match) {
  match('newdesk', 'home#newdesk');
  return match('', 'home#index');
};
