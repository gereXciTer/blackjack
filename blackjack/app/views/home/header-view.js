var View = require('views/base/view');

module.exports = View.extend({
  autoRender: true,
  className: 'header',
  tagName: 'header',
  template: require('./templates/header'),
  events: {
    'click #downloadExcel': 'downloadExcel'
  },
  downloadExcel: function(e){
    e.preventDefault();
  	$('#stories-list').html('');
  	$('.stories-list li.story').each(function(index, el){
			$('#stories-list').append('<tr><td>' + $(el).find('h4').text().trim() + '</td><td>' + $(el).find('.estimation').text().trim() + '</td></tr>');
    });
    $('#downloadExcelTrigger').attr('download', $('.desk-name').text().trim() + '.csv')
    downloadExcelTrigger.click();
  }
});
