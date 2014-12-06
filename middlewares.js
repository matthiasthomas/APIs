getRole = function(user) {
	models.Role.findOne({
		_id: user._role,
		archived: false
	}).exec(function(error, role) {
		if (error)
			res.send(error);

		return role;
	});
};

var middlewares = {
	authenticate: function(config, models) {
		return function(req, res, next) {
			console.log(req.path);
			if (config.securedPaths.indexOf(req.path) >= 0) {
				console.log('unsecured path');
				next();
				return;
			}

			console.log('securedPaths');
			var token_key = req.body.token;
			console.log('token_key: ' + token_key);
			if (token_key) {
				models.Token.findOne({
					key: token_key,
					archived: false
				}).populate('_user').exec(function(error, token) {
					if (error)
						res.send(error);

					//Token has expired
					if (token.hasExpired) {
						res.status(403);
						res.json({
							"status": 403,
							"message": "Token Expired"
						});
						return;
					} else {
						req.mydata.role = getRole(_user);
						next(); //Everything's fine, go to next middleware
					}
				});
			} else {
				res.status(403);
				res.json({
					'status': 403,
					'message': 'Invalid token'
				});
			}
		};
	},
	header: function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
		res.header("Access-Control-Allow-Headers", "Content-Type,x-access-token");
		next();
	}
};

module.exports.authenticate = middlewares.authenticate;
module.exports.header = middlewares.header;