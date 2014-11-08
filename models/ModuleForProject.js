var mongoose = require('mongoose');
var Db = require('./Db.js').Db;

var ModuleForProjectModel = Db.model('ModuleForProject', new mongoose.Schema({
	_module: {
		type: String,
		required: true,
		ref: 'Module'
	},
	_project: {
		type: String,
		required: true,
		ref: 'Project'
	},
	active: {
		type: Boolean,
		default: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: Date,
	archived: {
		type: Boolean,
		default: false
	}
}));

exports.ModuleForProject = ModuleForProjectModel;