module.exports.controller = function(app, config, modules, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/tokens/:token_id 
	// --------------------------------------------
	router.route('/tokens/:token_id')

	// Get a token from its id
	.get(function(req, res) {
		models.Token.findOne({
			_id: req.params.token_id,
			archived: false
		}, function(error, token) {
			if (error)
				res.send(error);

			res.json({
				success: true,
				token: token
			});
		});
	})

	// Update an existing token
	.put(function(req, res) {
		models.Token.findById(req.params.token_id, function(error, token) {
			if (error)
				res.send(error);

			//Set token attributes
			token.key = req.body.key;
			token._user = req.body._user;
			token.updated = Date.now();

			token.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					success: true,
					message: 'Token was updated',
					token: token
				});
			});
		});
	})

	// Delete a given token
	.delete(function(req, res) {
		models.Token.findById(req.params.token_id, function(error, token) {
			if (error)
				res.send(error);

			//Set token attributes
			token.archived = true;

			token.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					success: true,
					message: 'Token was deleted',
					token: token
				});
			});
		});
	});


	// --------------------------------------------
	// Routes to /api/tokens
	// --------------------------------------------
	router.route('/tokens')

	// Get all tokens
	.get(function(req, res) {
		models.Token.find({
			archived: false
		}).exec(function(error, tokens) {
			if (error)
				res.send(error);

			res.json({
				success: true,
				tokens: tokens
			});
		});
	})

	// Add a new token
	.post(function(req, res) {
		var token = new models.Token({
			// Set token attributes
			key: req.body.key,
			_user: req.body._user
		});

		// Save the token and check for errors
		token.save(function(error) {
			if (error)
				res.send(error);

			res.json({
				success: true,
				message: 'Token was saved!',
				token: token
			});
		});
	});
};