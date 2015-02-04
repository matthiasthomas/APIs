module.exports.controller = function(app, config, modules, models, middlewares, router) {

	var Role = modules.rbac.Role;
	var Permission = modules.rbac.Permission;

	// --------------------------------------------
	// Routes to /api/rbac/roles
	// --------------------------------------------
	router.route('/rbac/roles')

	//Get all available roles
	.get(function(req, res) {
		Role.find(function(error, roles) {
			console.log('bonjour');
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
			console.log(req.body.permissions);
			var role = {};
			role[req.body.name] = req.body.permissions;
			console.log(role);
			modules.rbac.init(role, function(err, newRole) {
				if (err) {
					res.send(err);
					return;
				}

				console.log(newRole);
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