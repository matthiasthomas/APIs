module.exports.controller = function(app, config, modules, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/users/:user_id 
	// --------------------------------------------
	router.route('/users/:user_id')

	// Get a user from its id
	.get(function(req, res) {
		models.User.findById(req.params.user_id, function(error, user) {
			if (error)
				res.send(error);

			res.json(user);
		});
	})

	// Update an existing user
	.put(function(req, res) {
		models.User.findById(req.params.user_id, function(error, user) {
			if (error)
				res.send(error);

			//Set user attributes
			user.email = req.body.email;
			user.password = modules.bcrypt.hashSync(req.body.password, config.salt);
			user._role = req.body._role;
			user.updated = Date.now();

			user.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					message: 'User was updated',
					user: user
				});
			});
		});
	})

	// Delete a given user
	.delete(function(req, res) {
		models.User.findById(req.params.user_id, function(error, user) {
			if (error)
				res.send(error);

			//Set user attributes
			user.archived = true;

			user.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					message: 'User was deleted',
					user: user
				});
			});
		});
	});


	// --------------------------------------------
	// Routes to /api/users
	// --------------------------------------------
	router.route('/users')

	// Get all users
	.get(function(req, res) {
		models.User.find(function(error, users) {
			if (error)
				res.send(error);

			res.json(users);
		});
	})

	// Add a new user
	.post(function(req, res) {
		models.User.find({
			email: req.body.email
		}, function(error, users) {
			if (error)
				res.send(error);

			// Users with the same email were found
			if (users.length > 0) {
				res.send({
					success: false,
					message: 'This email already exists in our database'
				});

				// We couldn't find any user with the same email
			} else {
				//Check if role was sent.
				//!\\ Attention Faille //!\\
				models.Role.findOne({
					name: 'guest'
				}, function(error, role) {

					var _role = '';
					if (!req.body._role) {
						_role = role._id;
					} else {
						_role = req.body._role;
					}

					var user = new models.User({
						// Set user attributes
						email: req.body.email,
						password: req.body.password,
						_role: _role
					});

					// Hash the password with the salt
					user.password = modules.bcrypt.hashSync(user.password, config.salt);

					// Save the user and check for errors
					user.save(function(error) {
						if (error)
							res.send(error);

						res.json({
							success: true,
							message: 'User was saved!',
							user: user
						});
					});
				});
			}
		});
	});


	// --------------------------------------------
	// Routes to /api/users/login
	// --------------------------------------------
	router.route('/users/login')

	.post(function(req, res) {
		var email = req.body.email;
		var password = req.body.password;

		//Look for a user with this email
		models.User.findOne({
			email: req.body.email
		}, function(error, user) {
			if (error)
				res.send(error);

			//If we didn't find any user with this email
			if (!user) {
				res.json({
					success: false,
					message: 'There are no register user with the email: ' + email
				});
			} else {

				//Compare the given password with the stored hash
				modules.bcrypt.compare(password, user.password, function(error, ok) {
					if (error)
						res.send(error);

					//Password and Username do not match
					if (!ok) {
						res.json({
							success: false,
							message: 'Username and Password do not match!'
						});

						//Password and Username matches, a token is created
					} else {
						modules.crypto.randomBytes(48, function(err, randomKey) {
							var key = randomKey.toString("hex");

							var token = new models.Token({
								//Set token attributes
								key: key,
								_user: user._id
							});

							token.save(function(error) {
								if (error)
									res.send(error);

								res.json({
									success: true,
									message: 'Connection established',
									token: token.key
								});
							});
						});
					}
				});
			}
		});
	});

	// --------------------------------------------
	// Routes to /api/users/logout
	// --------------------------------------------
	router.route('/users/logout')

	.post(function(req, res) {
		var token_key = req.body.token;
		//Look for the user associated to this token
		models.Token.findOne({
			key: token_key
		}, function(error, token) {
			if (error)
				res.send(error);

			//If we found an associated token
			if (token) {
				models.Token.remove({
					_id: token._id
				}, function(error, token) {
					if (error)
						res.send(error);

					res.json({
						success: true,
						message: 'You have been successfully disconnected!'
					});
				});
			} else {
				res.json({
					success: true,
					message: 'You have been successfully disconnected!'
				});
			}
		});
	});

	// --------------------------------------------
	// Routes to /api/users/isLoggedIn
	// --------------------------------------------
	router.route('/users/isLoggedIn')

	.post(function(req, res) {
		var token_key = req.body.token;

		models.Token.findOne({
			key: token_key
		}, function(error, token) {
			if (error)
				res.send(error);

			//If we found an associated token
			if (token) {
				res.json({
					success: true,
					isLoggedIn: true
				});
			} else {
				res.json({
					success: false,
					isLoggedIn: false
				});
			}
		});
	});
};