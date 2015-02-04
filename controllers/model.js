module.exports.controller = function(app, config, modules, models, middlewares, router) {

	// --------------------------------------------
	// Routes to /api/models/update
	// --------------------------------------------
	router.route('/models/update')

	// Here we're going to get all the files in the models folder and check if any new file was added
	// If so, it means that a new model was created and we have to create a new model object
	.get(function(req, res) {
		// The model names array
		var modelsNames = [];
		// Loop trough the files and folders in the models folder
		// We use ./ here because this script will be called by server.js
		modules.fs.readdirSync("./models").forEach(function(file) {
			// If the file is not a folder
			if (file.indexOf(".") != -1) {
				// There are only js files in the folder so we substract the last 3 characters of the 
				// file name => .js
				var fileName = file.substr(0, file.length - 3);
				// get the file extension
				var fileExt = file.substr(-3);
				// If it's effectively .js
				if (fileExt == ".js") {
					//And that it's not the db model
					if (fileName != "Db") {
						//Add it's name to the modelsNames array
						modelsNames.push(fileName);
					}
				}
				// The file is a folder
			} else {
				// We're going to loop through the files in this folder they cannot be folders
				modules.fs.readdirSync("./models/" + file).forEach(function(subFile) {
					// Get the fileName
					var fileName = subFile.substr(0, subFile.length - 3);
					// Get the file extension
					var fileExt = subFile.substr(-3);
					// If it's a js file
					if (fileExt == ".js") {
						// And it's not a db model
						if (fileName != "Db") {
							// Add it's name to the modelsNames array => projectName.modelName (ex: akioo.user)
							modelsNames.push(file + "." + fileName);
						}
					}
				});
			}
		});

		// This array will contain the models that are not yet in the db
		var modelsToAdd = [];
		// count will tell us when we've finished looping through the modelsNames array
		// as we're using mongoose findOne which is an asynchronous function
		var count = 0;
		modelsNames.forEach(function(modelName) {
			// Find a model with the name modelName
			models.Model.findOne({
				name: modelName
			}, function(error, model) {
				// Increment count on each loop
				count++;
				if (error) {
					res.send(error);
					return;
				}

				// If the model wasn't found in the db,
				if (!model) {
					//Add its name to the modelsToAdd array
					modelsToAdd.push(modelName);
				}
				// If we've looped through all of the elements of modelsNames array
				// We're going to start adding the modelToAdd to the db
				if (count == (modelsNames.length)) {
					// Reinitialize count for the new foreach
					count = 0;
					//Bad solution to prevent sending multiple times the res.json in model.save callback
					var sent = false;
					if (modelsToAdd.length > 0) {
						// Loop through the modelsToAdd
						modelsToAdd.forEach(function(modelName) {
							// Increment count on each loop
							count++;
							// create a new model
							model = new models.Model({
								name: modelName
							});

							// Save it
							model.save(function(error, model) {
								if (error) {
									res.send(error);
									return;
								}

								// If we've finished looping through the modelsToAdd array 
								if (count == (modelsToAdd.length) && !sent) {
									//send the result
									sent = true;
									res.json({
										success: true,
										message: "Operation completed!",
										addedModels: modelsToAdd
									});
									return;
								}
							});
						});
					} else {
						//send the result
						res.json({
							success: true,
							message: "Operation completed!",
							addedModels: modelsToAdd
						});
						return;
					}
				}
			});
		});
	});


	// --------------------------------------------
	// Routes to /api/models/:model_id 
	// --------------------------------------------
	router.route('/models/:model_id')

	// Get a model from its id
	.get(function(req, res) {
		models.Model.findOne({
			_id: req.params.model_id,
			archived: false
		}, function(error, model) {
			if (error) {
				res.send(error);
				return;
			}

			res.json({
				success: true,
				model: model
			});
			return;
		});
	})

	// Update an existing model
	.put(function(req, res) {
		models.Model.findById(req.params.model_id, function(error, model) {
			if (error)
				res.send(error);

			//Set model attributes
			model.name = req.body.name;
			model.updated = Date.now();

			model.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					success: true,
					message: 'model was updated',
					model: model
				});
			});
		});
	})

	// Delete a given model
	.delete(function(req, res) {
		models.Model.findById(req.params.model_id, function(error, model) {
			if (error)
				res.send(error);

			//Set model attributes
			model.archived = true;

			model.save(function(error) {
				if (error)
					res.send(error);

				res.json({
					success: true,
					message: 'model was deleted',
					model: model
				});
			});
		});
	});


	// --------------------------------------------
	// Routes to /api/models
	// --------------------------------------------
	router.route('/models')

	// Get all models
	.get(function(req, res) {
		models.Model.find({
			archived: false
		}).exec(function(error, models) {
			if (error) {
				res.send(error);
				return;
			}

			res.json({
				success: true,
				models: models
			});
			return;
		});
	})

	// Add a new model
	.post(function(req, res) {
		var model = new models.Model({
			// Set model attributes
			name: req.body.name
		});

		// Save the model and check for errors
		model.save(function(error, model) {
			if (error)
				res.send(error);

			res.json({
				success: true,
				message: 'model was saved!',
				model: model
			});
		});
	});
};