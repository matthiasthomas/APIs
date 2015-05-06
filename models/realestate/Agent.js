var mongoose = require('mongoose');
var Db = require('../Db.js').Db;

var AgentModel = Db.model('Agent', new mongoose.Schema({
	name: {
		first: String,
		last: String
	},
	_image: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Image'
	},
	phone: String,
	email: String,
	projects: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	}],
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

exports.Agent = AgentModel;