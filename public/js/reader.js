$(function() {
	var login = "https://www.google.com/accounts/ClientLogin";
	$.post(login, {
		accountType: "HOSTED_OR_GOOGLE",
		Email: "lvjian700@gmail.com",
		Passwd: "Sorcerer",
		service: "reader",
		source: 'lv_reader'
	}, function(data) {
		console.log(data);
	})
});