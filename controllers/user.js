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
		}).populate('roles', 'name').exec(function(error, user) {
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
		if (req.mydata.user.roles.indexOf('superhero') > -1) {
			models.User.findOne({
				_id: req.params.user_id,
				archived: false
			}).select('-password').populate('roles', 'name').exec(function(error, user) {
				if (error) return res.send(error);

				return res.json({
					success: true,
					user: user
				});
			});
		} else if (req.mydata.user.roles.indexOf('administrator') > -1) {
			//First let's find all of the usersProjects documents for our user
			models.UsersProject.find({
				archived: false,
				_user: req.mydata.user._id
			}, function(error, usersProjects) {
				var usersArray = [];
				//Now loop through this usersProjects
				usersProjects.forEach(function(usersProject, index, array) {
					// And find all of the usersProjects documents associated to the user's project
					models.UsersProject.find({
						archived: false,
						_project: usersProject._project
							// Here we use lean() to get an array of plain javascript objects, no need for class instance objects
							//  here, as we need to modify the results anyway
					}).populate('_user').lean().exec(function(error, usersProjects2) {
						if (error) return res.send(error);
						//Loop through all users which are bound to the projects of the admin user
						usersProjects2.forEach(function(usersProject2, index2, array2) {
							if (error) return res.send(error);

							usersProject2._user.password = "";
							//Check that we don't push the same user twice
							var found = false;
							usersArray.forEach(function(user) {
								//If the same mail is found twice we found it
								if (usersProject2._user.email === user.email) {
									found = true;
								}
							});

							//If the address wasn't found
							if (!found) { //||  (usersArray.length === 0)) {
								usersArray.push(usersProject2._user);
							}

							//Once we've looped through everything
							if ((index2 === (usersProjects2.length - 1)) && (index === (usersProjects.length - 1))) {

								usersArray = usersArray.filter(function(user) {
									return user._id == req.params.user_id;
								});

								var wantedUser = {};
								if (usersArray.length > 0) {
									wantedUser = usersArray[0];
									return res.json({
										success: true,
										user: wantedUser
									});
								} else {
									return res.json({
										success: false,
										message: 'User wasn\'t found'
									});
								}
							}
						});
					});
				});
			});
		} else {
			res.status = 403;
			return res.json({
				'status': 403,
				'message': 'You cannot access this content'
			});
		}
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
		var projectsUserHasAccessTo = [];
		var usersProjectsArr = [];
		var users = [];
		var found;
		//Get all the projects
		models.Project.find({
			archived: false
		}).select('name').exec(function(error, projects) {
			if (error) return res.send(error);
			if (projects && projects.length > 0) {
				//Loop through the projects
				projects.forEach(function(project, index) {
					// And check if the user has access to it
					req.mydata.user.hasAccess(project, function(error, success) {
						console.log(req.mydata.user.email + 'has access to ' + project.name);
						if (error) return res.send(error);
						// if s/he does, add it to the array
						if (success) projectsUserHasAccessTo.push(project);

						//Once we've looped through all the projects
						if (index == (projects.length - 1)) {
							console.log('Finished looping over projects');
							if (projectsUserHasAccessTo && projectsUserHasAccessTo.length > 0) {
								console.log("There are " + projectsUserHasAccessTo.length + " in projectsUserHasAccessTo");
								// Loop through the projects the user has access to
								projectsUserHasAccessTo.forEach(function(project, index1) {
									console.log("In " + project.name + ": ");
									// Find the usersProjects associated to it
									models.UsersProject.find({
										_project: project._id,
										archived: false
									}).populate('_user').exec(function(error, usersProjects) {
										console.log("usersProjects.length => " + usersProjects.length);
										if (error) return res.send(error);
										if (usersProjects && usersProjects.length > 0) usersProjectsArr.push(usersProjects);
										console.log("usersProjectsArr.length => " + usersProjectsArr.length);
										if (index1 == (projectsUserHasAccessTo.length - 1)) {
											console.log("Finished looping through projectsUserHasAccessTo");
											if (usersProjectsArr && usersProjectsArr.length > 0) {
												console.log("There are " + usersProjectsArr.length + " in usersProjectsArr");
												// Loop through those usersProjects (with their populated user)
												usersProjectsArr.forEach(function(usersProject, index2) {
													console.log("Viewing user: " + usersProject._user.email);
													// Remove the password before sending it
													usersProject._user.password = '';
													// Check if user doesn't already exist in users array
													found = false;
													users.forEach(function(user) {
														if (user.email === usersProject._user.email) {
															found = true;
														}
													});
													if (!found) users.push(usersProject._user);

													if (index2 == (usersProjects.length - 1)) {
														console.log('Finished looping through usersProjects');
														console.log('There are ' + users.length + "users to see");
														return res.json({
															success: true,
															users: users
														});
													}
												});
											} else {
												console.log("There are no usersProjects in usersProjectsArr");
												return res.json({
													success: true,
													users: users
												});
											}
										}
									});
								});
							} else {
								console.log("There are no projects in projectsUserHasAccessTo");
								return res.json({
									success: true,
									users: users
								});
							}
						}
					});
				});
			} else  {
				console.log('No projects at all');
				return res.json({
					success: true,
					users: users
				});
			}
		});
	})

	// Add a new user
	.post(function(req, res) {
		if (req.mydata.user._role.name === 'superhero') {
			models.User.find({
				email: req.body.email
			}, function(error, users) {
				if (error) return res.send(error);

				// Users with the same email were found
				if (users.length > 0) {
					return res.send({
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
							if (error) return res.send(error);

							return res.json({
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
			return res.json({
				status: 403,
				message: 'You cannot add a user'
			});
		}
	});
};