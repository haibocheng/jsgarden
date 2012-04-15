M = Backbone.Model;
V = Backbone.View;

$(function() {
	var store = new Store("posts");

	var Post = M.extend({
		localStorage: store,
		defaults: function() {
			return {
				title:"",
				date: new Date(),				
				postBody: "",
				tags: ''
			};
		},
		initialize: function() {
			if(!this.get('dateCreated')) {
				var date = this.defaults.dateCreated;
				this.set({"dateCreated": date});
			}
		},
		toggle: function(p) {
			this.save(p);
		}
	});

	var PostView = V.extend({
		tagName: 'div',
		className: 'post editing',
		template: _.template($('#post-template').html()),

		events: {
			"click #btnSave": "toggleDone",
			"click #btnEdit": "edit"
		},

		initialize: function() {
			this.model.bind('change', this.render, this);		
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			
			this.inputTitle = this.$('#title');
			this.inputBody = this.$('#postBody');
			this.inputTags = this.$('#tags');	

			return this;
		},

		toggleDone: function() {
			this.$el.removeClass("editing").addClass('view');

			this.model.toggle({
				title: this.inputTitle.val(),
				postBody: this.inputBody.val(),
				tags: this.inputTags.val(),
				date: new Date()
			});
		},
		edit: function() {
			this.$el.removeClass("view").addClass('editing');
			this.inputBody.focus();
		}
	});

	var app = new PostView({
		model: new Post()
	});

	$('#main').append(app.render().el);
});