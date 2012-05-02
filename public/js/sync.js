$(function() {

	var User = Backbone.Model.extend({
		urlRoot: '/users',
		defaults: {
			name: "lvjian",
			email: "lvjian@dayang.com.cn"
		},
		initialize: function() {

		}
	});

	console.log("create user");
	var u = new User;
	u.set({name: 'wyf'});
	u.save();

	/*
	u.destroy({
		success: function(model, response) {
			console.log('delete success');
		}
	});
*/
});

