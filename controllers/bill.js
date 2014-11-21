module.exports.controller = function(app, config, modules, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/bills/:bill_id 
	// --------------------------------------------
	router.route('/bills/:bill_id')

	// Get a bill from its id
	.get(function(req, res) {
		models.Bill.findOne({
			_id: req.params.bill_id,
			archived: false
		}, function(error, bill) {
			if (error)
				res.send(error);

			res.json({
				success: true,
				bill: bill
			});
		});
	})

	// Update an existing bill
	.put(function(req, res) {
		models.Bill.findById(req.params.bill_id, function(error, bill) {
			if (error)
				res.send(error);

			//Set bill attributes
			bill._project = req.body._project;
			bill.billLines = req.body.billLines;
			bill.updated = Date.now();

			bill.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					success: true,
					message: 'Bill was updated',
					bill: bill
				});
			});
		});
	})

	// Delete a given bill
	.delete(function(req, res) {
		models.Bill.findById(req.params.bill_id, function(error, bill) {
			if (error)
				res.send(error);

			//Set bill attributes
			bill.archived = true;

			bill.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					success: true,
					message: 'Bill was deleted',
					bill: bill
				});
			});
		});
	});


	// --------------------------------------------
	// Routes to /api/bills
	// --------------------------------------------
	router.route('/bills')

	// Get all bills
	.get(function(req, res) {
		models.Bill.find({
			archived: false
		}).exec(function(error, bills) {
			if (error)
				res.send(error);

			res.json({
				success: true,
				bills: bills
			});
		});
	})

	// Add a new bill
	.post(function(req, res) {
		var bill = new models.Bill({
			// Set bill attributes
			_project: req.body._project,
			billLines: req.body.billLines
		});

		// Save the bill and check for errors
		bill.save(function(error, bill) {
			if (error)
				res.send(error);

			res.json({
				success: true,
				message: 'Bill was saved!',
				bill: bill
			});
		});
	});
};