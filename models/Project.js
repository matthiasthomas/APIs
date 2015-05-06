var mongoose = require('mongoose');
var Db = require('./Db.js').Db;

var ProjectModel = Db.model('Project', new mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
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
	modules: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Module'
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