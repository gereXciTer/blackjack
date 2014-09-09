// Application routes.
module.exports = function(match) {
  match('desk/:id', 'desk#viewdesk');

  match('newdesk', 'home#newdesk');
  return match('', 'home#index');
};
