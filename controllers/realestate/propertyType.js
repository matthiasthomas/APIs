module.exports.controller = function(app, config, modules, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/realestate/propertyTypes/getForActiveUser 
	// --------------------------------------------
	router.route('/realestate/propertyTypes/getForActiveUser')

	.get(function(req, res) {
		var query = {
			archived: false
		};

		if (!req.mydata.isSuperhero) {
			query.projects = {
				$in: req.mydata.user.projects
			};
		}

		models.realestate.PropertyType.find(query).populate('projects').exec(function(error, propertyTypes) {
			if (error) return res.send(error);
			return res.json({
				success: true,
				propertyTypes: propertyTypes
			});
		});
	});

	// --------------------------------------------
	// Routes to /api/realestate/propertyTypes/:propertyType_id 
	// --------------------------------------------
	router.route('/realestate/propertyTypes/:propertyType_id')

	// Get a propertyType from its id
	.get(function(req, res) {
		models.realestate.PropertyType.findOne({
			archived: false,
			_id: req.params.propertyType_id
		}).populate('projects').exec(function(error, propertyType) {
			if (error) return res.send(error);
			return res.json({
				success: true,
				propertyType: propertyType
			});
		});
	})

	.put(function(req, res) {
		models.realestate.PropertyType.findOne({
			archived: false,
			_id: req.params.propertyType_id
		}, function(error, propertyType) {
			if (error) return res.send(error);
			if (!propertyType) {
				res.json({
					success: false,
					message: "Property Type doesn't exist!"
				});
			}

			propertyType.name = req.body.name;
			propertyType.description = req.body.description;
			propertyType.projects = req.body.projects;
			propertyType.updated = Date.now();
			propertyType.save(function(error, propertyType) {
				if (error) return res.send(error);
				return res.json({
					success: true,
					message: "Property type has been updated!",
					propertyType: propertyType
				});
			});
		});
	})

	.delete(function(req, res) {
		models.realestate.PropertyType.findOne({
			archived: false,
			_id: req.params.propertyType_id
		}, function(error, propertyType) {
			if (error) return res.send(error);
			if (!propertyType) {
				return res.json({
					success: true,
					message: "The property type has been removed!"
				});
			}
			propertyType.archived = true;
			propertyType.updated = Date.now();
			propertyType.save(function(error) {
				if (error) return res.send(error);
				return res.json({
					success: true,
					message: "The property type has been removed!"
				});
			});
		});
	});

	// --------------------------------------------
	// Routes to /api/realestate/propertyTypes
	// --------------------------------------------
	router.route('/realestate/propertyTypes')

	// Get all propertyTypes
	.get(function(req, res) {
		models.realestate.PropertyType.find({
			archived: false
		}).populate('projects').exec(function(error, propertyTypes) {
			if (error) return res.send(error);
			return res.json({
				success: true,
				propertyTypes: propertyTypes
			});
		});
	})

	.post(function(req, res) {
		var propertyType = new models.realestate.PropertyType({
			name: req.body.name,
			description: req.body.description,
			projects: req.body.projects
		});
		propertyType.save(function(error, propertyType) {
			if (error) return res.send(error);
			return res.json({
				success: true,
				propertyType: propertyType
			});
		});
	});
};