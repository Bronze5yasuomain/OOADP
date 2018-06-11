// Show home screen
exports.show = function(req, res) {
	// Render home screen
	res.render('index', {
		title: 'V@LUE',
		callToAction: 'ITP211'
	});
};
