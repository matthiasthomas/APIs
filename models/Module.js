var mongoose = require('mongoose');
var Db = require('./Db.js').Db;

var ModuleModel = Db.model('Module', new mongoose.Schema({
	name: String,
	details: String,
	costPerMonth: Number,
	fixedCost: Number,
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

exports.Module = ModuleModel;