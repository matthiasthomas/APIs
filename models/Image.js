var mongoose = require('mongoose');
var Db = require('./Db.js').Db;

var ImageModel = Db.model(
	'Image',
	new mongoose.Schema({
		url: String,
		size: String,
		created: {
			type: Date,
			default: Date.now
		},
		updated: Date,
		archived: {
			type: Boolean,
			default: false
		}
	})
);

exports.Image = ImageModel;