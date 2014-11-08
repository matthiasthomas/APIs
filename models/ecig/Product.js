var mongoose = require('mongoose');
var Db = require('./Db.js').Db;

var ProductModel = Db.model('Product', new mongoose.Schema({
	name: String,
	price: String,
	_category: {
		type: String,
		required: true,
		ref: 'Category'
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

exports.Product = ProductModel;