M = Backbone.Model;
V = Backbone.View;
CM = Backbone.Collection;

$(function() {

	var socket = io.connect('/');

	socket.on('welcome', function(data) {
		Messages.create(data);
	});

	socket.on('msg', function(data) {
		Messages.create(data);
	});

	var user = false;

	while(!user) {
		user = window.prompt('enter your name:');
		socket.emit('enter', {user: user});
	}


	var Message  = M.extend({
		defaults: function() {
			return {
				body: '',
				time: new Date(),
				sender: user
			};
		},
		// 初始化方法，确保设置了title
		initialize: function() {
			if (!this.get("time")) {
				var time = this.defaults.time;
				this.set({"time": time});
			}
		}
	});

	var MessageList = CM.extend({
		model: Message,
		localStorage: new Store("chat-backbone"),
		comparetor: function(message) {
			return todo.get('time');
		}
	});

	var Messages = new MessageList;

	var MessageView = V.extend({
		tagName: 'p',
		className: 'message-item',
		template: _.template($('#message-template').html()),

		initialize: function() {
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		clear: function() {
			this.model.clear();
		}
	});

	var AppView = V.extend({
		el: $('#main'),
		events: {
			"keypress #box": "sendOnEnter"
		},
		initialize: function() {
			this.input = this.$('#box');
			this.messageBox = this.$('#messageBox');
			this.title = this.$('#title');		

			Messages.bind('add', this.append, this);			
		},
		sendOnEnter: function(e) {
			if(e.keyCode != 13) {
				return;
			}
			var text = this.input.val();
			if(!text || text === '') {
				return;
			}
			
			var msg = {
				sender: user,
				body: text,
				time: new Date()
			};
			Messages.create(msg)

			socket.emit('send', msg);
			this.input.val('');
		},
		append: function(message) {
			var view = new MessageView({
				model: message
			});
			
			this.messageBox.append(view.render().el);
			this.title.html(
				moment(message.get('data')).format('MM:ss')
			);
		}
	});

	var App = new AppView;
});