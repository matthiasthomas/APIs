module.exports.controller = function(app, config, moduleForProjects, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/moduleForProjects/:moduleForProject_id 
	// --------------------------------------------
	router.route('/moduleForProjects/:moduleForProject_id')

	// Get a moduleForProject from its id
	.get(function(req, res) {
		models.ModuleForProject.findById(req.params.moduleForProject_id, function(error, moduleForProject) {
			if (error)
				res.send(error);

			res.json(moduleForProject);
		});
	})

	// Update an existing moduleForProject
	.put(function(req, res) {
		models.ModuleForProject.findById(req.params.moduleForProject_id, function(error, moduleForProject) {
			if (error)
				res.send(error);

			//Set moduleForProject attributes
			moduleForProject._module = req.body._module;
			moduleForProject._project = req.body._project;
			moduleForProject.updated = Date.now();

			moduleForProject.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					message: 'ModuleForProject was updated',
					moduleForProject: moduleForProject
				});
			});
		});
	})

	// Delete a given moduleForProject
	.delete(function(req, res) {
		models.ModuleForProject.findById(req.params.moduleForProject_id, function(error, moduleForProject) {
			if (error)
				res.send(error);

			//Set moduleForProject attributes
			moduleForProject.archived = true;

			moduleForProject.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					message: 'ModuleForProject was deleted',
					moduleForProject: moduleForProject
				});
			});
		});
	});


	// --------------------------------------------
	// Routes to /api/moduleForProjects
	// --------------------------------------------
	router.route('/moduleForProjects')

	// Get all moduleForProjects
	.get(function(req, res) {
		models.ModuleForProject.find(function(error, moduleForProjects) {
			if (error)
				res.send(error);

			res.json(moduleForProjects);
		});
	})

	// Add a new moduleForProject
	.post(function(req, res) {
		var moduleForProject = new models.ModuleForProject({
			// Set moduleForProject attributes
			_module: req.body._module,
			_project: req.body._project
		});

		// Save the moduleForProject and check for errors
		moduleForProject.save(function(error, moduleForProject) {
			if (error)
				res.send(error);

			res.json({
				message: 'ModuleForProject was saved!',
				moduleForProject: moduleForProject
			});
		});
	});
};