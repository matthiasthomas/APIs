module.exports.controller = function(app, config, modules, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/projects/:project_id
	// --------------------------------------------
	router.route('/projects/:project_id')

	// Get a project from its id
	.get(function(req, res) {
		models.Project.findOne({
			_id: req.params.project_id,
			archived: false
		}, function(error, project) {
			if (error) {
				res.send(error);
				return;
			}

			res.json({
				success: true,
				project: project
			});
			return;
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
			project.googleAnalyticsID = req.body.googleAnalyticsID;
			project.updated = Date.now();

			project.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					success: true,
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
					success: true,
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
		// If user is a superhero just return the projects
		req.mydata.user.hasRole('superhero', function(error, success) {
			if (error) return res.send(error);
			if (success) {
				models.Project.find({
					archived: false
				}, function(error, projects) {
					if (error) return res.send(error);
					return res.json({
						success: true,
						projects: projects
					});
				});
				// If the user is no superhero
			} else {
				// Get the project to which the user has an access
				models.Project.find({
					archived: false,
					_id: {
						$in: req.mydata.user.projects
					}
				}).exec(function(error, projects) {
					if (error) return res.send(error);
					// Check if the user has the right to get the projects
					req.mydata.user.can('Read', 'Project', function(error, can) {
						if (error) return res.send(error);
						if (!can) {
							res.status = 403;
							return res.json({
								message: "Unauthorized"
							});
						}
						return res.json({
							success: true,
							projects: projects
						});
					});
				});
			}
		});
	})

	// Add a new project
	.post(function(req, res) {

		var project = new models.Project({
			// Set project attributes
			name: req.body.name,
			contacts: req.body.contacts,
			googleAnalyticsID: req.body.googleAnalyticsID
		});

		// Save the project and check for errors
		project.save(function(error, project) {
			if (error) {
				res.send(error);
				return;
			}

			res.json({
				success: true,
				message: 'Project was saved!',
				project: project
			});
			return;
		});

	});
};