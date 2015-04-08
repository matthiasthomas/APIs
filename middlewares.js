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

			//If front is requesting available OPTIONS do it without auth
			if (req.method === 'OPTIONS') {
				next();
				return;
			}

			//**** To replace with a better way of handling permissions ****//
			if ((req.method === 'GET' && (req.path.indexOf('/api/projects/') > -1)) || (req.method === 'POST' && (req.path.indexOf('/api/users/forgot/') > -1))) {
				next();
				return;
			}

			//Check if requests an unsecuredPath, if so do it without auth
			if (config.unsecuredPaths.indexOf(req.path) >= 0) {
				next();
				return;
			}

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

								models.User.populate(token._user, [{
									path: 'roles'
								}, {
									path: 'projects'
								}], function(error, user) {
									if (error) return res.send(error);
									req.mydata = {};
									req.mydata.user = user;
									next();
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