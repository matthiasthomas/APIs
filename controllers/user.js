module.exports.controller = function(app, config, modules, models, middlewares, router) {

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
		}).populate('_role').exec(function(error, user) {
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

								user.password = "";

								res.json({
									success: true,
									message: 'Connection established',
									token: token.key,
									user: user
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

	.get(function(req, res) {
		var token_key = req.headers['x-access-token'];
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
			if (token && !token.hasExpired()) {
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


	// --------------------------------------------
	// Routes to /api/users/:user_id 
	// --------------------------------------------
	router.route('/users/:user_id')

	// Get a user from its id
	.get(function(req, res) {
		if (req.mydata.user._role.name === 'superhero') {
			models.User.findOne({
				_id: req.params.user_id,
				archived: false
			}).select('-password').populate('_role', 'name').exec(function(error, user) {
				if (error) {
					res.send(error);
					return;
				}

				res.json({
					success: true,
					user: user
				});
			});
		} else if (req.mydata.user._role.name === 'administrator') {
			models.UsersProject.find({
				archived: false,
				_user: req.mydata.user._id
			}, function(error, usersProjects) {
				var usersArray = [];
				usersProjects.forEach(function(usersProject, index, array) {
					models.UsersProject.find({
						archived: false,
						_project: usersProject._project
							// Here we use lean() to get an array of plain javascript objects, no need for class instance objects
							//  here, as we need to modify the results anyway
					}).populate('_user').lean().exec(function(error, usersProjects2) {
						if (error) {
							res.send(error);
							return;
						}
						//Loop through all users which are bound to the projects of the admin user
						usersProjects2.forEach(function(usersProject2, index2, array2) {

							models.Role.findOne({
								_id: usersProject2._user._role
							}).exec(function(error, role) {
								if (error) {
									res.send(error);
									return;
								}
								usersProject2._user._role = role;
								usersProject2._user.password = "";
								//Check that we don't push the same user twice
								var found = false;
								usersArray.forEach(function(user) {
									if (usersProject2._user.email === user.email) {
										found = true;
									}
								});

								if (!found ||  (usersArray.length === 0)) {
									usersArray.push(usersProject2._user);
								}

								//Once we've looped through everything we can
								if ((index2 === (usersProjects2.length - 1)) && (index === (usersProjects.length - 1))) {

									usersArray = usersArray.filter(function(user) {
										return user._id == req.params.user_id;
									});

									var wantedUser = {};
									if (usersArray.length > 0) {
										wantedUser = usersArray[0];
										res.json({
											success: true,
											user: wantedUser
										});
									} else {
										res.json({
											success: false,
											message: 'User wasn\'t found'
										});
									}
								}
							});
						});
					});
				});
			});
		} else {
			res.status = 403;
			res.json({
				'status': 403,
				'message': 'You cannot access this content'
			});
		}
	})

	// Update an existing user
	.put(function(req, res) {
		//If the user is superhero or the active user, he can update the user
		if (req.mydata.user._role.name === 'superhero' ||  req.mydata.user._id === req.params.user_id) {
			models.User.findById(req.params.user_id, function(error, user) {
				if (error)
					res.send(error);

				//Set user attributes
				user.email = req.body.email;
				if (req.body.password && req.body.password !== '') {
					user.password = modules.bcrypt.hashSync(req.body.password, config.salt);
				}
				user._role = req.body._role;
				user.updated = Date.now();

				user.save(function(error) {
					if (error)
						res.send(error);

					res.json({
						success: true,
						message: 'User was updated',
						user: user
					});
				});
			});
		} else {
			res.status = 403;
			res.json({
				status: 403,
				message: 'You cannot update this content'
			});
		}
	})

	// Delete a given user
	.delete(function(req, res) {
		if (req.mydata.user._role.name === 'superhero' ||  req.mydata.user._id === req.params.user_id) {
			models.User.findById(req.params.user_id, function(error, user) {
				if (error)
					res.send(error);

				//Set user attributes
				user.archived = true;

				user.save(function(error) {
					if (error)
						res.send(error);

					res.json({
						success: true,
						message: 'User was deleted',
						user: user
					});
				});
			});
		} else {
			res.status = 403;
			res.json({
				status: 403,
				message: 'You cannont delete this content'
			});
		}
	});


	// --------------------------------------------
	// Routes to /api/users
	// --------------------------------------------
	router.route('/users')

	// Get all users
	.get(function(req, res) {
		//If it's the superhero who's trying to access
		if (req.mydata.user._role.name === 'superhero') {
			models.User.find({
				archived: false
			}).select('-password').populate('_role', 'name').exec(function(error, users) {
				if (error)
					res.send(error);

				res.json({
					success: true,
					users: users
				});
			});
			//If it's an administrator
		} else if (req.mydata.user._role.name === 'administrator') {
			models.UsersProject.find({
				archived: false,
				_user: req.mydata.user._id
			}, function(error, usersProjects) {
				var usersArray = [];
				usersProjects.forEach(function(usersProject, index, array) {
					models.UsersProject.find({
						archived: false,
						_project: usersProject._project
							// Here we use lean() to get an array of plain javascript objects, no need for class instance objects
							//  here, as we need to modify the results anyway
					}).populate('_user').lean().exec(function(error, usersProjects2) {
						if (error) {
							res.send(error);
							return;
						}
						usersProjects2.forEach(function(usersProject2, index2, array2) {
							models.Role.findOne({
								_id: usersProject2._user._role
							}).exec(function(error, role) {
								if (error) {
									res.send(error);
									return;
								}
								usersProject2._user._role = role;
								usersProject2._user.password = "";
								//Look if we havent already added this user
								var found = false;
								usersArray.forEach(function(user) {
									if (usersProject2._user.email === user.email) {
										found = true;
									}
								});

								if (!found ||  (usersArray.length === 0)) {
									usersArray.push(usersProject2._user);
								}

								if ((index2 === (usersProjects2.length - 1)) && (index === (usersProjects.length - 1))) {
									res.json({
										success: true,
										users: usersArray
									});
								}
							});
						});
					});
				});
			});
			//If it's just a guest or else
		} else {
			res.status = 403;
			res.json({
				'status': 403,
				'message': 'You cannot access this content'
			});
		}
	})

	// Add a new user
	.post(function(req, res) {
		if (req.mydata.user._role.name === 'superhero') {
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
		} else {
			res.status = 403;
			res.json({
				status: 403,
				message: 'You cannot add a user'
			});
		}
	});
};