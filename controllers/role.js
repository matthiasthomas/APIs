module.exports.controller = function(app, config, modules, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/roles
	// --------------------------------------------
	router.route('/roles/:id')

	// Get a role from its id
	.get(function(req, res) {
		var roleId = req.params.id;
		var role = {};
		modules.async.series([
			function(callback) {
				// Get the role
				models.Role.findOne({
					_id: roleId,
					archived: false
				}).populate('projects permissions').exec(function(error, roleResult) {
					role = roleResult;
					// Role is results[0]
					callback(error, role);
				});
			},
			function(callback) {
				// Check if user can read Role (can is results[1])
				req.mydata.user.can('read', 'Role', callback);
			},
			function(callback) {
				// Check if user has access to any of the roles' associated projects
				// (hasAccess is results[2])
				req.mydata.user.hasAccessToAny(role.projects, callback);
			}
		], function(error, results) {
			if (error) return res.send(error);
			if (results[1] && results[2]) {
				return res.json({
					success: true,
					role: results[0]
				});
			}
		});
	})

	.put(function(req, res) {
		var roleId = req.params.id;
		var name = req.body.name;
		var permissions = req.body.permissions;
		var projects = req.body.projects;
		models.Role.findById(roleId, function(error, role) {
			if (error) return res.send(error);
			if (!role) return done(new Error("Unknown role"));

			role.name = name;
			modules.permissionManager.createOrUpdateRole(
				models.Role,
				models.Permission,
				models.Project,
				role,
				permissions,
				projects,
				function(error, role) {
					if (error) return res.send(error);

					return res.json({
						success: true,
						message: "The role has been successfully updated!",
						role: role
					});
				});
		});
	})

	.delete(function(req, res) {
		var roleId = req.params.id;
		models.Role.findById(roleId, function(error, role) {
			if (error) {
				res.send(error);
				return;
			}

			if (role) {
				role.archived = true;
				role.save(function(error, role) {
					if (error) {
						res.send(error);
						return;
					}

					res.json({
						success: true,
						message: "The role has been removed"
					});
				});
			} else {
				res.send("This role has already been removed");
			}
		});
	});

	// --------------------------------------------
	// Routes to /api/roles
	// --------------------------------------------
	router.route('/roles')

	//Get all available roles
	.get(function(req, res) {
		// If user is a superhero, return everything
		var query = {
			archived: false
		};
		// If s/he can read Role but is not a superhero, we have to check which projects
		// s/he can access and return the associated roles (+the default admin role)
		if (!req.mydata.isSuperhero) {
			query.$or = [{
				name: 'administrator'
			}, {
				projects: {
					$in: req.mydata.user.projects
				}
			}];
		}
		models.Role.find(query).populate('permissions projects').exec(function(error, roles) {
			if (error) return res.send(error);
			// Now check if user can read roles
			req.mydata.user.can('read', 'Role', function(error, can) {
				if (error) return res.send(error);
				if (!can) {
					res.status = 403;
					return res.json({
						status: 403,
						message: "Unauthorized"
					});
				}
				return res.json({
					success: true,
					roles: roles
				});
			});
		});
	})

	//Add a new role
	.post(function(req, res) {
		if (req.body.name && req.body.permissions && req.body.projects) {
			var role = new models.Role({
				name: req.body.name
			});
			modules.permissionManager.createOrUpdateRole(
				models.Role,
				models.Permission,
				models.Project,
				role,
				req.body.permissions,
				req.body.projects,
				function(error, role) {
					if (error) return res.send(error);

					return res.json({
						success: true,
						message: "Your role has been saved!",
						role: role
					});
				});
		}
	});
};