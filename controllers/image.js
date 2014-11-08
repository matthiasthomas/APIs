module.exports.controller = function(app, config, modules, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/images/:image_id 
	// --------------------------------------------
	router.route('/images/:image_id')

	// Get a image from its id
	.get(function(req, res) {
		models.Image.findById(req.params.image_id, function(error, image) {
			if (error)
				res.send(error);

			res.json(image);
		});
	})

	// Update an existing image
	.put(function(req, res) {
		models.Image.findById(req.params.image_id, function(error, image) {
			if (error)
				res.send(error);

			//Set image attributes
			image.url = req.params.url;
			image.size = req.params.size;
			image.updated = Date.now();

			image.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					message: 'Image was updated',
					image: image
				});
			});
		});
	})

	// Delete a given image
	.delete(function(req, res) {
		models.Image.findById(req.params.image_id, function(error, image) {
			if (error)
				res.send(error);

			//Set image attributes
			image.archived = true;

			image.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					message: 'Image was deleted',
					image: image
				});
			});
		});
	});


	// --------------------------------------------
	// Routes to /api/images
	// --------------------------------------------
	router.route('/images')

	// Get all images
	.get(function(req, res) {
		models.Image.find(function(error, images) {
			if (error)
				res.send(error);

			res.json(images);
		});
	})

	// Add a new image
	.post(function(req, res) {
		if (req.body.url && req.body.size && req.body._product) {
			var image = new models.Image({
				url: req.body.url,
				size: req.body.size
			});

			image.save(function(error, image) {
				if (error)
					res.send(error);

				res.json({
					message: "The image has been saved successfully!",
					image: image
				});
			});
		} else {
			res.json({
				message: 'There was an error with the information you sent!'
			});
		}
	});
};