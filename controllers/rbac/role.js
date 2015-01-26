module.exports.controller = function(app, config, modules, models, middlewares, router) {

	var Role = modules.rbac.Role;

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
		var role = req.body.role;
		if (role) {
			var newRole = new Role({
				name: role.name,
				permissions: role.permissions
			});
			newRole.save(function(error, savedRole) {
				res.json({
					success: true,
					message: 'You\'re role has been saved!',
					role: savedRole
				});
				return;
			});
		}
	});
};