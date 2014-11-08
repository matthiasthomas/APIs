var mongoose = require('mongoose');
var Db = require('./Db.js').Db;

var UsersProjectModel = Db.model('UsersProject', new mongoose.Schema({
	_user: {
		type: String,
		required: true,
		ref: 'User'
	},
	_project: {
		type: String,
		required: true,
		ref: 'Project'
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

exports.UsersProject = UsersProjectModel;