var mongoose = require('mongoose');
var Db = require('./Db.js').Db;

var ProjectModel = Db.model('Project', new mongoose.Schema({
	name: String,
	contacts: [{
		label: String,
		address: String,
		city: String,
		zipcode: String,
		country: String,
		phones: [{
			number: String,
			type: {
				type: String
			}
		}]
	}],
	created: {
		type: Date,
		default: Date.now
	},
	updated: Date,
	archived: {
		type: Boolean,
		default: false
	},
	googleAnalyticsID: String
}));

exports.Project = ProjectModel;