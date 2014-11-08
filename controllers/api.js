module.exports.controller = function(app, config, modules, models, middlewares, router) {
	router.route('/')

	.get(function(req, res) {
		res.send('Api is running');
	});
}