// Application routes.
module.exports = function(match) {
  match('desk/:id', 'desk#viewdesk');

  match('error404', 'home#error404');
  match('newdesk', 'home#newdesk');
  return match('', 'home#index');
};
