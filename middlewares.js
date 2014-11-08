var middlewares = {
	authentication: function(role) {
		
	},
	controller: function(app, config, modules, models, middlewares, router) {

	},
	header: function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
		res.header("Access-Control-Allow-Headers", "Content-Type,x-access-token");
		next();
	}
}

module.exports.controller = middlewares.controller;
module.exports.header = middlewares.header;