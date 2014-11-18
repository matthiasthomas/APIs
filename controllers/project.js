module.exports.controller = function(app, config, projects, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/projects/:project_id 
	// --------------------------------------------
	router.route('/projects/:project_id')

	// Get a project from its id
	.get(function(req, res) {
		models.Project.findById(req.params.project_id, function(error, project) {
			if (error)
				res.send(error);

			res.json(project);
		});
	})

	// Update an existing project
	.put(function(req, res) {
		models.Project.findById(req.params.project_id, function(error, project) {
			if (error)
				res.send(error);

			//Set project attributes
			project.name = req.body.name;
			project.contacts = req.body.contacts;
			project.updated = Date.now();

			project.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					message: 'Project was updated',
					project: project
				});
			});
		});
	})

	// Delete a given project
	.delete(function(req, res) {
		models.Project.findById(req.params.project_id, function(error, project) {
			if (error)
				res.send(error);

			//Set project attributes
			project.archived = true;

			project.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					message: 'Project was deleted',
					project: project
				});
			});
		});
	});


	// --------------------------------------------
	// Routes to /api/projects
	// --------------------------------------------
	router.route('/projects')

	// Get all projects
	.get(function(req, res) {
		models.Project.find(function(error, projects) {
			if (error)
				res.send(error);

			res.json({
				success: true,
				projects: projects
			});
		});
	})

	// Add a new project
	.post(function(req, res) {

		var project = new models.Project({
			// Set project attributes
			name: req.body.project.name,
			contacts: req.body.project.contacts
		});

		// Save the project and check for errors
		project.save(function(error, project) {
			if (error)
				res.send(error);

			res.json({
				success: true,
				message: 'Project was saved!',
				project: project
			});
		});

	});
};