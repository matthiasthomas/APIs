var mongoose = require('mongoose');
var Db = require('../Db.js').Db;

var PropertyTypeModel = Db.model('PropertyType', new mongoose.Schema({
	name: String,
	description: String,
	created: {
		type: Date,
		default: Date.now
	},
	projects: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	}],
	updated: Date,
	archived: {
		type: Boolean,
		default: false
	}
}));

exports.PropertyType = PropertyTypeModel;