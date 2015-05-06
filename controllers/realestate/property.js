module.exports.controller = function(app, config, modules, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/realestate/properties/getForProject/:project_id
	// --------------------------------------------
	router.route('/realestate/properties/getForProject/:project_id')

	.get(function(req, res) {
		// req.body can contain:
		// sort: "field" or "-field"
		// whereEq: {"field", "value"}
		// whereGt: {"field", "value"}
		// whereLt: {"field", value}
		// limit: "value"
		// 
		models.realestate.Property.find({
			archived: false,
			projects: req.params.project_id
		}).populate('images mainImage _propertyType').exec(function(error, properties) {
			if (error) return res.send(error);
			res.json({
				success: true,
				properties: properties
			});
		});
	});

	// --------------------------------------------
	// Routes to /api/realestate/properties/getForActiveUser
	// --------------------------------------------
	router.route('/realestate/properties/getForActiveUser')

	.get(function(req, res) {
		var query = {
			archived: false
		};

		if (!req.mydata.isSuperhero) {
			query.projects = {
				$in: req.mydata.user.projects
			};
		}
		models.realestate.Property
			.find(query)
			.populate('images mainImage _propertyType projects')
			.exec(function(error, properties) {
				if (error) return res.send(error);
				return res.json({
					success: true,
					properties: properties
				});
			});
	});

	// --------------------------------------------
	// Routes to /api/realestate/properties/images
	// --------------------------------------------
	router.route('/realestate/properties/images')

	.post(function(req, res) {
		var path = __dirname + "/../../uploads/" + req.files.file.name;
		modules.async.parallel({
				// Small
				small: function(callback) {
					var newPath = __dirname + '/../../uploads/s/' + req.files.file.name;
					modules.sharp(path)
						.resize(150)
						.max()
						.toFormat('jpeg')
						.toFile(newPath, function(error) {
							if (error) return callback(error);
							return callback(null, '/uploads/s/' + req.files.file.name);
						});
				},
				// Medium
				medium: function(callback) {
					var newPath = __dirname + '/../../uploads/m/' + req.files.file.name;
					modules.sharp(path)
						.resize(400)
						.max()
						.toFormat('jpeg')
						.toFile(newPath, function(error) {
							if (error) return callback(error);
							return callback(null, '/uploads/m/' + req.files.file.name);
						});
				},
				// Large
				large: function(callback) {
					var newPath = __dirname + '/../../uploads/l/' + req.files.file.name;
					modules.sharp(path)
						.resize(1024)
						.max()
						.toFormat('jpeg')
						.toFile(newPath, function(error) {
							if (error) return callback(error);
							return callback(null, '/uploads/l/' + req.files.file.name);
						});
				}
			},
			function(error, results) {
				if (error) {
					return res.json({
						success: false,
						message: error
					});
				}
				modules.fs.unlink(__dirname + "/../../uploads/" + req.files.file.name, function(error) {
					if (error) {
						return res.json({
							success: false,
							message: error
						});
					}

					var image = new models.Image({
						s: results.small,
						m: results.medium,
						l: results.large
					});

					image.save(function(error, image) {
						if (error) return res.send(error);
						return res.json({
							success: true,
							image: image
						});
					});
				});
			});
	});

	// --------------------------------------------
	// Routes to /api/realestate/properties/:property_id 
	// --------------------------------------------
	router.route('/realestate/properties/:property_id')

	// Get a property from its id
	.get(function(req, res) {
		models.realestate.Property.findOne({
			archived: false,
			_id: req.params.property_id
		}).populate('images mainImage _propertyType projects').exec(function(error, property) {
			if (error) return res.send(error);
			if (!property) return res.send(new Error("Property not found"));
			return res.json({
				success: true,
				property: property
			});
		});
	})

	.put(function(req, res) {
		models.realestate.Property.findOne({
			archived: false,
			_id: req.params.property_id
		}).populate('images').exec(function(error, property) {
			if (error) return res.send(error);
			if (!property) return res.send(new Error("Property not found!"));

			// Delete the images that aren't used anymore
			property.images.forEach(function(oldImage) {
				var found = false;
				req.body.images.forEach(function(newImage) {
					if (oldImage._id == newImage._id) found = true;
				});
				if (!found) {
					// Delete oldImage
					modules.async.parallel({
						deleteS: function(callback) {
							modules.fs.unlink(__dirname + "/../.." + oldImage.s, callback);
						},
						deleteM: function(callback) {
							modules.fs.unlink(__dirname + "/../.." + oldImage.m, callback);
						},
						deleteL: function(callback) {
							modules.fs.unlink(__dirname + "/../.." + oldImage.l, callback);
						}
					}, function(error, results) {
						if (error) return res.send(error);
						oldImage.remove(function(error) {
							if (error) return res.send(error);
						});
					});
				}
			});

			property.title = req.body.title;
			property.region = {
				title: req.body.region.title,
				latitude: req.body.region.latitude,
				longitude: req.body.region.longitude
			};
			property._propertyType = req.body._propertyType;
			property.bedrooms = req.body.bedrooms;
			property.price = req.body.price;
			property.description = req.body.description;
			property.mainImage = req.body.mainImage;
			property.images = req.body.images;
			property.projects = req.body.projects;
			property.updated = Date.now();

			property.save(function(error, property) {
				if (error) return res.send(error);
				return res.json({
					success: true,
					property: property
				});
			});
		});
	})

	.delete(function(req, res) {
		models.realestate.Property.findOne({
			archived: false,
			_id: req.params.property_id
		}, function(error, property) {
			if (error) return res.send(error);
			if (!property) return res.send(new Error("Property doesn't exist"));
			property.archived = true;
			property.updated = Date.now();
			property.save(function(error, property) {
				if (error) return res.send(error);
				return res.json({
					success: true,
					message: "Property has been deleted successfully"
				});
			});
		});
	});

	// --------------------------------------------
	// Routes to /api/realestate/properties
	// --------------------------------------------
	router.route('/realestate/properties')

	// Get all properties
	.get(function(req, res) {
		// req.query can contain:
		// sort = field or -field
		// eq = field,value
		// gte = field,value
		// lte = field,value
		// gt = field,value
		// lt = field,value
		// limit = value

		var query = models.realestate.Property.find({
			archived: false
		});
		if (req.query.sort) {
			query.sort(req.query.sort);
		} else {
			query.sort('-created');
		}
		if (req.query.eq) query.where(req.query.eq.split(',')[0]).equals(req.query.eq.split(',')[1]);
		if (req.query.gte) query.where(req.query.gte.split(',')[0]).gte(req.query.gte.split(',')[1]);
		if (req.query.lte) query.where(req.query.lte.split(',')[0]).lte(req.query.lte.split(',')[1]);
		if (req.query.gt) query.where(req.query.gt.split(',')[0]).gt(req.query.gt.split(',')[1]);
		if (req.query.lt) query.where(req.query.lt.split(',')[0]).lt(req.query.lt.split(',')[1]);
		if (req.query.limit) query.limit(req.query.limit);

		query.populate('images mainImage _propertyType projects').exec(function(error, properties) {
			if (error) return res.send(error);
			return res.json({
				success: true,
				properties: properties
			});
		});
	})

	.post(function(req, res) {
		var property = new models.realestate.Property({
			title: req.body.title,
			region: {
				title: req.body.region.title,
				latitude: req.body.region.latitude,
				longitude: req.body.region.longitude
			},
			_propertyType: req.body._propertyType,
			bedrooms: req.body.bedrooms,
			price: req.body.price,
			description: req.body.description,
			mainImage: req.body.mainImage,
			images: req.body.images,
			projects: req.body.projects
		});

		property.save(function(error, property) {
			if (error) return res.send(error);
			return res.json({
				success: true,
				property: property
			});
		});
	});
};