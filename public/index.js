$(document).ready(function () {
	$.get('/loginCheck', function(data) {
		console.log(data);
		if('success' !== data ) {
			alert("Login failed!");
		} else {
			alert("Login success!");
		}
	});
});
