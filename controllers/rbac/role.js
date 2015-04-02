module.exports.controller = function(app, config, modules, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/rbac/roles
	// --------------------------------------------
	router.route('/rbac/roles/:id')

	// Get a role from its id
	.get(function(req, res) {
		var roleId = req.params.id;
		models.Role.findOne({
			_id: roleId,
			archived: false
		}).populate('permissions').exec(function(error, role) {
			if (error) return res.send(error);

			return res.json({
				success: true,
				role: role
			});
		});
	})

	.put(function(req, res) {
		var roleId = req.params.id;
		var name = req.body.name;
		var permissions = req.body.permissions;
		models.Role.findById(roleId, function(error, role) {
			if (error) {
				res.send(error);
				return;
			}

			//The only way for now is to delete the role first
			role.remove(function(error, role) {
				var roleObj = {};
				roleObj[req.body.name] = req.body.permissions;
				modules.permissionManager.init(models.Role, models.Permission, roleObj, function(err, newRole) {
					if (err) {
						res.send(err);
						return;
					}

					res.json({
						success: true,
						message: "The role has been updated!",
						role: role
					});
					return;
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
	// Routes to /api/rbac/roles
	// --------------------------------------------
	router.route('/rbac/roles')

	//Get all available roles
	.get(function(req, res) {
		models.Role.find({
			archived: false
		}).populate('permissions').exec(function(error, roles) {
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