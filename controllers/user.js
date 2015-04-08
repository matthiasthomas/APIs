module.exports.controller = function(app, config, modules, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/users/forgot
	// --------------------------------------------
	router.route('/users/forgot/:email')

	.post(function(req, res) {
		var email = req.params.email;
		models.User.findOne({
			email: email
		}, function(error, user) {
			if (error) return res.send(error);
			if (user) {
				//Create a new password
				modules.crypto.randomBytes(12, function(err, randomKey) {
					//The new pass for the user
					var pass = randomKey.toString("hex");
					//Hash the pass for the db
					user.password = modules.bcrypt.hashSync(pass, config.salt);
					user.save(function(error, user) {
						if (error) return res.send(error);

						return res.json({
							success: true
						});

						//Send a mail to the user with it's new password
						modules.mail.sendMail({
							from: "Akioo <password@akioo.com>", // sender address
							to: user.email, // comma separated list of receivers
							subject: "Akioo Password reset", // Subject line
							text: "Your password has been reset. Try to connect with your new password: " + pass // plaintext body
						}, function(error, info) {
							if (error) {
								console.log(error);
							} else {
								console.log('Message sent: ' + info.response);
							}
						});
					});
				});
			} else {
				return res.json({
					success: false
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
		}).populate({
			path: 'roles',
			select: '_id name'
		}).populate({
			path: 'projects',
			select: '_id name'
		}).exec(function(error, user) {
			if (error) return res.send(error);

			//If we didn't find any user with this email
			if (!user) {
				return res.json({
					success: false,
					message: 'There are no register user with the email: ' + email
				});
			} else {

				//Compare the given password with the stored hash
				modules.bcrypt.compare(password, user.password, function(error, ok) {
					if (error) return res.send(error);

					//Password and Username do not match
					if (!ok) {
						return res.json({
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
								if (error) return res.send(error);

								user.password = "";

								return res.json({
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
			key: token_key,
			archived: false
		}, function(error, token) {
			if (error) return res.send(error);

			//If we found an associated token
			if (token) {
				token.archived = true;
				token.save(function(error, token) {
					if (error) return res.send(error);

					return res.json({
						success: true,
						message: 'You have been successfully disconnected!'
					});
				});
			} else {
				return res.json({
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
			key: token_key,
			archived: false
		}, function(error, token) {
			if (error) return res.send(error);

			//If we found an associated token
			if (token && !token.hasExpired()) {
				return res.json({
					success: true,
					isLoggedIn: true
				});
			} else {
				return res.json({
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
		models.User.findOne({
			archived: false,
			_id: req.params.user_id
		}).populate('projects', 'name').populate('roles', 'name').exec(function(error, user) {
			if (error) return res.send(error);
			if (!user) return res.send(new Error("Couln't find user with this id"));
			modules.async.parallel({
				isSuperHero: function(callback) {
					req.mydata.user.hasRole("superhero", function(error, success) {
						if (error) callback(error);
						callback(null, success);
					});
				},
				isAdmin: function(callback) {
					req.mydata.user.hasRole("administrator", function(error, success) {
						if (error) callback(error);
						callback(null, success);
					});
				},
				hasAccessToAny: function(callback) {
					req.mydata.user.hasAccessToAny(user.projects, function(error, success) {
						if (error) callback(error);
						callback(null, success);
					});
				},
				isActiveUser: function(callback) {
					var success = false;
					if (req.mydata.user._id.equals(req.params.user_id)) success = true;
					callback(null, success);
				}
			}, function(error, results) {
				if (results.isSuperHero || (results.isAdmin && results.hasAccessToAny) || results.isActiveUser) {
					res.json({
						success: true,
						user: user
					});
				} else {
					res.status(403);
					res.json({
						status: 403,
						message: "Unauthorized"
					});
				}
			});
		});
	})

	// Update an existing user
	.put(function(req, res) {
		models.User.findById(req.params.user_id).populate('roles').exec(function(error, user) {
			if (error)
				res.send(error);

			//Set user attributes
			user.email = req.body.email;
			if (req.body.password && req.body.password !== '') {
				user.password = modules.bcrypt.hashSync(req.body.password, config.salt);
			}
			console.log(req.body.roles);
			user.updated = Date.now();
			var oldRoles = user.roles;
			user.roles = req.body.roles;
			console.log(user.roles);

			var deferred = modules.q.defer();
			var promise = deferred.promise;

			//Remove the old roles
			oldRoles.forEach(function(oldRole, index) {
				user.removeRole(oldRole.name, function(error) {
					if (error) return res.send(error);

					if (index == (oldRoles.length - 1)) {
						console.log("finished removing roles");
						console.log(user.roles);
						deferred.resolve();
					}
				});
			});

			var deferred2 = modules.q.defer();
			var promise2 = deferred2.promise;

			promise.then(function() {
				console.log("Welcome to promise");
				//Add the new roles
				console.log(user.roles);
				user.roles.forEach(function(newRole, index) {
					console.log("newRole " + index + ": ");
					console.log(newRole);
					models.Role.findOne(newRole, function(error, role) {
						if (error) return res.send(error);

						console.log(role.name);
						user.addRole(role.name, function(error) {
							if (error) return res.send(error);

							console.log("role " + role.name + " added!");
							if (index == (user.roles.length - 1)) {
								console.log("finished adding roles");
								deferred2.resolve();
							}
						});
					});
				});
			});

			promise2.then(function() {
				console.log("Welcome to promise2");
				user.save(function(error) {
					if (error) return res.send(error);

					return res.json({
						success: true,
						message: 'User was updated',
						user: user
					});
				});
			});
		});
	})

	// Delete a given user
	.delete(function(req, res) {
		if (req.mydata.user._role.name === 'superhero' ||  req.mydata.user._id === req.params.user_id) {
			models.User.findById(req.params.user_id, function(error, user) {
				if (error) return res.send(error);

				if (user) {
					models.UsersProject.find({
						_user: user._id
					}, function(error, usersProjects) {
						usersProjects.forEach(function(usersProject, index) {
							usersProject.archived = true;
							usersProject.save(function(error) {
								if (error) return res.send(error);

								if (index == (usersProjects.length - 1)) {
									//Set user attributes
									user.archived = true;

									user.save(function(error) {
										if (error) return res.send(error);

										return res.json({
											success: true,
											message: 'User was deleted',
											user: user
										});
									});
								}
							});
						});
					});
				}
			});
		} else {
			res.status = 403;
			return res.json({
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
		// Check if s/he is a superhero
		req.mydata.user.hasRole("superhero", function(error, success) {
			if (error) return res.send(error);
			// If s/he is
			if (success) {
				models.User.find({
					archived: false
				}).populate('projects', 'name').populate('roles', 'name').exec(function(error, users) {
					if (error) return res.send(error);
					return res.json({
						success: true,
						users: users
					});
				});
				// If s/he isn't a superhero
			} else {
				//check if user can get the users (Read User)
				req.mydata.user.can('Read', 'User', function(error, success) {
					if (error) return res.send(error);
					if (!success) return res.send(new Error("Unauthorized"));

					models.User.find({
						archived: false,
						projects: {
							$in: req.mydata.user.projects
						}
					}).populate('projects', 'name').populate('roles', 'name').exec(function(error, users) {
						if (error) return res.send(error);
						return res.json({
							success: true,
							users: users
						});
					});
				});
			}
		});
	})

	// Add a new user
	.post(function(req, res) {
		// First check if the user that is going to be added has the role superhero,
		// Or administrator, if s/he does, check the activeUser's role, if it's a superhero
		// or an admin of the site, it's ok
		var user = req.body.user;
		var projects = req.body.projects;
		var roles = req.body.roles;

		modules.async.parallel({
			userToAddIsSuperhero: function(callback) {
				var found = false;
				for (var j = 0; j < projects.length; j++) {
					projects[j] = projects[j]._id;
				}
				for (var i = 0; i < roles.length; i++) {
					if (roles[i].name === 'superhero') found = true;
					roles[i] = roles[i]._id;
				}
				callback(null, found);
			},
			activeUserHasAccess: function(callback) {
				req.mydata.user.hasAccessToAll(projects, function(error, success) {
					if (error) return res.send(error);
					callback(null, success);
				});
			},
			activeUserIsSuperhero: function(callback) {
				req.mydata.user.hasRole('superhero', function(error, success) {
					if (error) callback(error);
					callback(null, success);
				});
			}
		}, function(error, results) {
			if (error) return res.send(error);

			if ((!results.userToAddIsSuperhero && results.activeUserHasAccess) || results.activeUserIsSuperhero) {
				console.log('roles');
				console.log(roles);
				console.log('projects');
				console.log(projects);
				var userObj = new models.User({
					// Set user attributes
					email: user.email,
					password: user.password,
					roles: roles,
					projects: projects
				});
				// Hash the password with the salt
				userObj.password = modules.bcrypt.hashSync(userObj.password, config.salt);
				// Save the user and check for errors
				userObj.save(function(error) {
					if (error) return res.send(error);

					return res.json({
						success: true,
						message: 'User was saved!',
						user: user
					});
				});


			} else {
				res.status = 403;
				return res.json({
					status: 403,
					message: 'Unauthorized!'
				});
			}
		});
	});
};