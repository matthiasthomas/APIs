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
				return next();
			}

			// If the path doesn't concern the API, let go
			if (req.path.indexOf('/api') < 0) {
				return next();
			}

			//**** To replace with a better way of handling permissions ****//
			var unsecuredPathsWithParams = ['/api/realestate/properties/getForProject/', '/api/users/forgot/', '/api/realestate/properties/'];
			var found = false;
			unsecuredPathsWithParams.forEach(function(path) {
				if (req.path.indexOf(path) > -1 && req.path.indexOf('getForActiveUser') < 0) {
					found = true;
				}
			});
			if (found) return next();

			//Check if requests an unsecuredPath, if so do it without auth
			if (config.unsecuredPaths.indexOf(req.path) >= 0) {
				return next();
			}

			var token_key = req.headers['x-access-token'];
			if (token_key && token_key !== 'null' && token_key !== null && token_key !== undefined) {
				models.Token.findOne({
					key: token_key,
					archived: false
				}).populate('_user').exec(function(error, token) {
					if (error) {
						return res.send(error);
					}

					if (token) {
						//Token has expired
						if (token.hasExpired()) {
							//We delete the token (but keep it in the db by archiving it)
							token.archived = true;
							token.save(function(error) {
								if (error) {
									return res.send(error);
								}

								res.status(403);
								return res.json({
									"status": 403,
									"message": "Token Expired"
								});
							});
						} else {
							//If the user is still active, we update its token for as long as he sends new requests
							token.updated = Date.now();
							token.save(function(error) {
								if (error) return res.send(error);

								models.User.populate(token._user, [{
									path: 'roles'
								}, {
									path: 'projects'
								}], function(error, user) {
									if (error) return res.send(error);
									req.mydata = {};
									req.mydata.user = user;
									req.mydata.user.hasRole('superhero', function(error, success) {
										if (error) return res.send(error);
										req.mydata.isSuperhero = success;
										return next();
									});
								});
							});
						}
					} else {
						res.status(403);
						return res.json({
							'status': 403,
							'message': 'Invalid token'
						});
					}
				});
			} else {
				res.status(403);
				return res.json({
					'status': 403,
					'message': 'Invalid token'
				});
			}
		};
	},
	header: function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET,OPTIONS,PUT,POST,DELETE");
		res.header("Access-Control-Allow-Headers", "Content-Type,x-access-token");
		return next();
	}
};

module.exports.authenticate = middlewares.authenticate;
module.exports.header = middlewares.header;