module.exports.controller = function(app, config, modules, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/realestate/agents/getForActiveUser
	// --------------------------------------------
	router.route('/realestate/agents/getForActiveUser')

	.get(function(req, res) {
		var query = {
			archived: false
		};

		if (!req.mydata.isSuperhero) {
			query.projects = {
				$in: req.mydata.user.projects
			};
		}

		models.realestate.Agent
			.find(query)
			.populate('_image projects')
			.exec(function(error, agents) {
				if (error) return res.send(error);
				res.json({
					success: true,
					agents: agents
				});
			});
	});

	// --------------------------------------------
	// Routes to /api/realestate/agents/images
	// --------------------------------------------
	router.route('/realestate/agents/images')

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
	// Routes to /api/realestate/agents/:agent_id 
	// --------------------------------------------
	router.route('/realestate/agents/:agent_id')

	// Get a agent from its id
	.get(function(req, res) {
		models.realestate.Agent.find({
			archived: false,
			_id: req.params.agent_id
		}).populate('_image').exec(function(error, agent) {
			if (error) return res.send(error);
			return res.json({
				success: true,
				agent: agent
			});
		});
	})

	.put(function(req, res) {
		models.realestate.Agent.findOne({
			archived: false,
			_id: req.params.agent_id
		}).populate('_image').exec(function(error, agent) {
			if (error) return res.send(error);
			if (!agent) return res.send(new Error("Agent not found!"));

			// Delete the image that isn't used anymore
			if (req.body._image._id !== agent._image._id) {
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

			agent.name.first = req.body.name.first;
			agent.name.last = req.body.name.last;
			agent._image = req.body._image;
			agent.phone = req.body.phone;
			agent.email = req.body.email;
			agent.projects = req.body.projects;
			agent.updated = Date.now();

			agent.save(function(error, agent) {
				if (error) return res.send(error);
				res.json({
					success: true,
					agent: agent
				});
			});
		});
	})

	.delete(function(req, res) {
		models.realestate.Agent.findOne({
			archived: false,
			_id: req.params.agent_id
		}, function(error, agent) {
			if (error) return res.send(error);
			if (!agent) return res.send(new Error("Agent not found!"));

			agent.updated = Date.now();
			agent.archived = true;
			agent.save(function(error) {
				if (error) return res.send(error);
				return res.json({
					success: true,
					message: "Agent has been successfully deleted!"
				});
			});
		});
	});

	// --------------------------------------------
	// Routes to /api/realestate/agents
	// --------------------------------------------
	router.route('/realestate/agents')

	// Get all agents
	.get(function(req, res) {
		// req.query can contain:
		// sort = field or -field
		// eq = field,value
		// gte = field,value
		// lte = field,value
		// gt = field,value
		// lt = field,value
		// limit = value

		var query = models.realestate.Agent.find({
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

		query.populate('_image').exec(function(error, agents) {
			if (error) return res.send(error);
			return res.json({
				success: true,
				agents: agents
			});
		});
	})

	.post(function(req, res) {
		var agent = new models.realestate.Agent({
			name: {
				first: req.body.name.first,
				last: req.body.name.last
			},
			_image: req.body._image,
			phone: req.body.phone,
			email: req.body.email,
			projects: req.body.projects
		});

		agent.save(function(error, agent) {
			if (error) return res.send(error);
			return res.json({
				success: true,
				agent: agent
			});
		});
	});
};