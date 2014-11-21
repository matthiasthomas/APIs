module.exports.controller = function(app, config, modules, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/ecig/products/:product_id 
	// --------------------------------------------
	router.route('/ecig/products/:product_id')

	// Get a product from its id
	.get(function(req, res) {
		models.ecig.Product.findOne({
			_id: req.params.product_id,
			archived: false
		}, function(error, product) {
			if (error)
				res.send(error);

			res.json({
				success: true,
				product: product
			});
		});
	})

	// Update an existing product
	.put(function(req, res) {
		models.ecig.Product.findById(req.params.product_id, function(error, product) {
			if (error)
				res.send(error);

			product.name = req.body.name; // Set product name
			product.price = req.body.price; // Set price
			product._category = req.body._category; // Set category
			product.updated = Date.now();

			product.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					success: true,
					message: 'Product was updated',
					product: product
				});
			});
		});
	})

	// Delete a given product
	.delete(function(req, res) {
		models.ecig.Product.findById(req.params.product_id, function(error, product) {
			if (error)
				res.send(error);

			product.archived = true;

			product.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					success: true,
					message: 'Product was deleted',
					product: product
				});
			});
		});
	});


	// --------------------------------------------
	// Routes to /api/ecig/products
	// --------------------------------------------
	router.route('/ecig/products')

	// Get all products
	.get(function(req, res) {
		models.ecig.Product.find({
			archived: false
		}).exec(function(error, products) {
			if (error)
				res.send(error);

			res.json({
				success: true,
				products: products
			});
		});
	})

	// Add a new product
	.post(function(req, res) {
		var product = new models.ecig.Product({
			name: req.body.name, // Set product name
			price: req.body.price, // Set price
			_category: req.body._category // Set category
		});

		// Save the product and check for errors
		product.save(function(error) {
			if (error)
				res.send(error);

			res.json({
				success: true,
				message: 'Product was saved!',
				product: product
			});
		});
	});
};