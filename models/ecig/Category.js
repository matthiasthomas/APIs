var mongoose = require('mongoose');
var Db = require('./Db.js').Db;

var CategoryModel = Db.model('Category', new mongoose.Schema({
	name: String,
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

exports.Category = CategoryModel;