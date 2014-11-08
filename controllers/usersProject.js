module.exports.controller = function(app, config, modules, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/usersProjects/:usersProject_id 
	// --------------------------------------------
	router.route('/usersProjects/:usersProject_id')

	// Get a usersProject from its id
	.get(function(req, res) {
		models.UsersProject.findById(req.params.usersProject_id, function(error, usersProject) {
			if (error)
				res.send(error);

			res.json(usersProject);
		});
	})

	// Update an existing usersProject
	.put(function(req, res) {
		models.UsersProject.findById(req.params.usersProject_id, function(error, usersProject) {
			if (error)
				res.send(error);

			//Set usersProject attributes
			usersProject._user = req.body._user;
			usersProject._project = req.body._project;
			usersProject.updated = Date.now();

			usersProject.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					message: 'UsersProject was updated',
					usersProject: usersProject
				});
			});
		});
	})

	// Delete a given usersProject
	.delete(function(req, res) {
		models.UsersProject.findById(req.params.usersProject_id, function(error, usersProject) {
			if (error)
				res.send(error);

			//Set usersProject attributes
			usersProject.archived = true;

			usersProject.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					message: 'UsersProject was deleted',
					usersProject: usersProject
				});
			});
		});
	});


	// --------------------------------------------
	// Routes to /api/usersProjects
	// --------------------------------------------
	router.route('/usersProjects')

	// Get all usersProjects
	.get(function(req, res) {
		models.UsersProject.find(function(error, usersProjects) {
			if (error)
				res.send(error);

			res.json(usersProjects);
		});
	})

	// Add a new usersProject
	.post(function(req, res) {
		console.log(req.params);
		var usersProject = new models.UsersProject({
			// Set usersProject attributes
			_user: req.body._user,
			_project: req.body._project
		});

		// Save the usersProject and check for errors
		usersProject.save(function(error) {
			if (error)
				res.send(error);

			res.json({
				message: 'UsersProject was saved!',
				usersProject: usersProject
			});
		});
	});
};