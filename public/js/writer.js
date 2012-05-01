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
		},
		toggle: function(p) {
			this.save(p);
		},
		//TODO add validate to post
		validate: function(attrs) {
			if (attrs.title.length < 4) {
				return "The title should have more than 4 characters."
			};
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
			this.model.bind('error', this.showErrors, this);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			
			this.inputTitle = this.$('#title');
			this.inputBody = this.$('#postBody');
			this.inputTags = this.$('#tags');	

			return this;
		},

		toggleDone: function() {			

			this.model.toggle({
				title: this.inputTitle.val(),
				postBody: this.inputBody.val(),
				tags: this.inputTags.val(),
				date: new Date()
			});

			if(this.model.isValid()) {
				this.$el.removeClass("editing").addClass('view');	
			}			
		},
		edit: function() {
			this.$el.removeClass("view").addClass('editing');
			this.inputBody.focus();
		},
		showErrors: function(model, error) {
			alert(error);
		}
	});

	var app = new PostView({
		model: new Post()
	});

	$('#main').append(app.render().el);
});