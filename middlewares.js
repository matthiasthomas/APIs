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

			if (req.method === 'OPTIONS') {
				next();
				return;
			}

			if (config.unsecuredPaths.indexOf(req.path) >= 0 || req.path == '/api' || req.path == '/api/') {
				next();
				return;
			}

			//console.log(req.headers['x-access-token']);

			var token_key = req.headers['x-access-token'];
			if (token_key && token_key !== 'null' && token_key !== null && token_key !== undefined) {
				models.Token.findOne({
					key: token_key,
					archived: false
				}).populate('_user').exec(function(error, token) {
					if (error) {
						res.send(error);
						return;
					}

					//console.log(token.key);

					if (token) {
						//Token has expired
						if (token.hasExpired()) {
							//We delete the token (but keep it in the db by archiving it)
							token.archived = true;
							token.save(function(error) {
								if (error) {
									res.send(error);
									return;
								}

								res.status(403);
								res.json({
									"status": 403,
									"message": "Token Expired"
								});
								return;
							});
						} else {
							//If the user is still active, we update its token for as long as he sends new requests
							token.updated = Date.now();
							token.save(function(error) {
								if (error) {
									res.send(error);
									return;
								}

								models.Role.findOne({
									_id: token._user._role,
									archived: false
								}).exec(function(error, role) {
									if (error)
										res.send(error);
									req.mydata = {};
									req.mydata.user = JSON.parse(JSON.stringify(token._user));
									req.mydata.user._role = role;
									next(); //Everything's fine, go to next middleware
								});
							});
						}
					} else {
						res.status(403);
						res.json({
							'status': 403,
							'message': 'Invalid token'
						});
						return;
					}
				});
			} else {
				res.status(403);
				res.json({
					'status': 403,
					'message': 'Invalid token'
				});
				return;
			}
		};
	},
	header: function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET,OPTIONS,PUT,POST,DELETE");
		res.header("Access-Control-Allow-Headers", "Content-Type,x-access-token");
		next();
	}
};

module.exports.authenticate = middlewares.authenticate;
module.exports.header = middlewares.header;