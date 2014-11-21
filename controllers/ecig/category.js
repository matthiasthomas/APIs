module.exports.controller = function(app, config, modules, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/ecig/categories/:category_id 
	// --------------------------------------------
	router.route('/ecig/categories/:category_id')

	// Get a category from its id
	.get(function(req, res) {
		models.ecig.Category.findOne({
			_id: req.params.category_id,
			archived: false
		}, function(error, category) {
			if (error)
				res.send(error);

			res.json({
				success: true,
				category: category
			});
		});
	})

	// Update an existing category
	.put(function(req, res) {
		models.ecig.Category.findById(req.params.category_id, function(error, category) {
			if (error)
				res.send(error);

			category.name = req.body.name;
			category.updated = Date.now();

			category.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					success: true,
					message: 'Category was updated',
					category: category
				});
			});
		});
	})

	// Delete a given category
	.delete(function(req, res) {
		models.ecig.Category.findById(req.params.category_id, function(error, category) {
			if (error)
				res.send(error);

			category.archived = true;
			category.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					success: true,
					message: 'Category was deleted',
					category: category
				});
			});
		});
	});


	// --------------------------------------------
	// Routes to /api/ecig/categories
	// --------------------------------------------
	router.route('/ecig/categories')

	// Get all categories
	.get(function(req, res) {
		models.ecig.Category.find({
			archived: false
		}).exec(function(error, categories) {
			if (error)
				res.send(error);

			res.json({
				success: true,
				categories: categories
			});
		});
	})

	// Add a new category
	.post(function(req, res) {
		var category = new models.ecig.Category({
			name: req.body.name // Set category name
		});

		// Save the category and check for errors
		category.save(function(error) {
			if (error)
				res.send(error);

			res.json({
				success: true,
				message: 'Category was saved!',
				category: category
			});
		});
	});
};