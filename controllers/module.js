module.exports.controller = function(app, config, modules, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/modules/:module_id 
	// --------------------------------------------
	router.route('/modules/:module_id')

	// Get a module from its id
	.get(function(req, res) {
		models.module.findOne({
			_id: req.params.module_id,
			archived: false
		}, function(error, module) {
			if (error)
				res.send(error);

			res.json({
				success: true,
				module: module
			});
		});
	})

	// Update an existing module
	.put(function(req, res) {
		models.module.findById(req.params.module_id, function(error, module) {
			if (error)
				res.send(error);

			//Set module attributes
			module.name = req.body.name;
			module.details = req.body.details;
			module.costPerMonth = req.body.costPerMonth;
			module.fixedCost = req.body.fixedCost;
			module.updated = Date.now();

			module.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					success: true,
					message: 'module was updated',
					module: module
				});
			});
		});
	})

	// Delete a given module
	.delete(function(req, res) {
		models.module.findById(req.params.module_id, function(error, module) {
			if (error)
				res.send(error);

			//Set module attributes
			module.archived = true;

			module.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					success: true,
					message: 'module was deleted',
					module: module
				});
			});
		});
	});


	// --------------------------------------------
	// Routes to /api/modules
	// --------------------------------------------
	router.route('/modules')

	// Get all modules
	.get(function(req, res) {
		models.module.find({
			archived: false
		}).exec(function(error, modules) {
			if (error)
				res.send(error);

			res.json({
				success: true,
				modules: modules
			});
		});
	})

	// Add a new module
	.post(function(req, res) {
		var module = new models.module({
			// Set module attributes
			name: req.body.name,
			details: req.body.details,
			costPerMonth: req.body.costPerMonth,
			fixedCost: req.body.fixedCost
		});

		// Save the module and check for errors
		module.save(function(error, module) {
			if (error)
				res.send(error);

			res.json({
				success: true,
				message: 'module was saved!',
				module: module
			});
		});
	});
};