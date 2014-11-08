module.exports.controller = function(app, config, modules, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/messages/:message_id 
	// --------------------------------------------
	router.route('/messages/:message_id')

	// Get a message from its id
	.get(function(req, res) {
		models.Message.findById(req.params.message_id, function(error, message) {
			if (error)
				res.send(error);

			res.json(message);
		});
	})

	// Update an existing message
	.put(function(req, res) {
		models.Message.findById(req.params.message_id, function(error, message) {
			if (error)
				res.send(error);

			//Set message attributes
			message._user = req.body._user;
			message.subject = req.body.subject;
			message.content = req.body.content;
			message.updated = Date.now();

			message.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					message: 'Message was updated',
					messageObj: message
				});
			});
		});
	})

	// Delete a given message
	.delete(function(req, res) {
		models.Message.findById(req.params.message_id, function(error, message) {
			if (error)
				res.send(error);

			//Set message attributes
			message.archived = true;

			message.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					message: 'Message was deleted',
					messageObj: message
				});
			});
		});
	});


	// --------------------------------------------
	// Routes to /api/messages
	// --------------------------------------------
	router.route('/messages')

	// Get all messages
	.get(function(req, res) {
		models.Message.find(function(error, messages) {
			if (error)
				res.send(error);

			res.json(messages);
		});
	})

	// Add a new message
	.post(function(req, res) {
		var message = new models.Message({
			// Set message attributes
			_user: req.body._user,
			subject: req.body.subject,
			content: req.body.content
		});

		// Save the message and check for errors
		message.save(function(error, message) {
			if (error)
				res.send(error);

			res.json({
				message: 'Message was saved!',
				messageObj: message
			});
		});
	});
};