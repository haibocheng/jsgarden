$(function() {	
	$('code, pre').addClass('prettyprint1');
	prettyPrint();
	
	var book = {};	
	_.extend(book, Backbone.Events);
	
	$('#onEvent').click(function() {
		book.on('alert', function(msg) {
			alert('Triggered event from book Object: ' + msg)
		});		
	});
	
	$('#offEvent').click(function() {
		book.off('alert');
	});
	
	$('#fireEvent').click(function() {
		book.trigger('alert', 'trigge event!');
	});	
	
	var Note = Backbone.Model.extend({
		defaults: {
			"title": 'jsgarden',
			"content": 'text....'
		}
	});
	var note = new Note;
	
	note.on('change:title', function() {
		alert('new data of title: ' + this.get('title'));
	});		
	
	$('#btnTitle').click(function() {
		note.set({title: 'jsgarden new title'});
	});
});