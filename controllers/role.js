module.exports.controller = function(app, config, modules, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/roles/:role_id 
	// --------------------------------------------
	router.route('/roles/:role_id')

	// Get a role from its id
	.get(function(req, res) {
		models.Role.findById(req.params.role_id, function(error, role) {
			if (error)
				res.send(error);

			res.json(role);
		});
	})

	// Update an existing role
	.put(function(req, res) {
		models.Role.findById(req.params.role_id, function(error, role) {
			if (error)
				res.send(error);

			//Set role attributes
			role.name = req.body.name;
			role.updated = Date.now();

			role.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					message: 'Role was updated',
					role: role
				});
			});
		});
	})

	// Delete a given role
	.delete(function(req, res) {
		models.Role.findById(req.params.role_id, function(error, role) {
			if (error)
				res.send(error);

			//Set role attributes
			role.archived = true;

			role.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					message: 'Role was deleted',
					role: role
				});
			});
		});
	});


	// --------------------------------------------
	// Routes to /api/roles
	// --------------------------------------------
	router.route('/roles')

	// Get all roles
	.get(function(req, res) {
		models.Role.find(function(error, roles) {
			if (error)
				res.send(error);

			res.json(roles);
		});
	})

	// Add a new role
	.post(function(req, res) {
		console.log(req.params);
		var role = new models.Role({
			// Set role attributes
			name: req.body.name
		});

		// Save the role and check for errors
		role.save(function(error) {
			if (error)
				res.send(error);

			res.json({
				message: 'Role was saved!',
				role: role
			});
		});
	});
};