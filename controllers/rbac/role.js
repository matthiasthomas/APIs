module.exports.controller = function(app, config, modules, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/rbac/roles
	// --------------------------------------------
	router.route('/rbac/roles/:id')

	// Get a role from its id
	.get(function(req, res) {
		var roleId = req.params.id;
		models.Role.findById(roleId).populate('permissions').exec(function(error, role) {
			if (error) {
				res.send(error);
				return;
			}

			res.json({
				success: true,
				role: role
			});
			return;
		});
	})

	.put(function(req, res) {
		var roleId = req.params.id;
		console.log(req.params);
		var name = req.body.name;
		var permissions = req.body.permissions;
		console.log(roleId);
		models.Role.findById(roleId, function(error, role) {
			if (error) {
				res.send(error);
				return;
			}

			res.json({
				success: true,
				message: "The role has been updated!",
				role: role
			});
		});
	});

	// --------------------------------------------
	// Routes to /api/rbac/roles
	// --------------------------------------------
	router.route('/rbac/roles')

	//Get all available roles
	.get(function(req, res) {
		models.Role.find().populate('permissions').exec(function(error, roles) {
			if (error) {
				res.send(error);
				return;
			}

			res.json({
				success: true,
				roles: roles
			});
		});
	})

	//Add a new role
	.post(function(req, res) {
		if (req.body.name && req.body.permissions) {
			var role = {};
			role[req.body.name] = req.body.permissions;
			modules.permissionManager.init(models.Role, models.Permission, role, function(err, newRole) {
				if (err) {
					res.send(err);
					return;
				}

				console.log('SUCCESS');
				res.json({
					success: true,
					message: "Everything went well, your role has been saved!",
					role: newRole
				});
				return;
			});
		}
	});
};