var mongoose = require('mongoose');
var Db = require('./Db.js').Db;

var BillLineSchema = new mongoose.Schema({
	label: String,
	details: String,
	cost: Number,
	quantity: Number,
	created: {
		type: Date,
		default: Date.now
	},
	updated: Date,
	archived: {
		type: Boolean,
		default: false
	}
});

var BillModel = Db.model('Bill', new mongoose.Schema({
	_project: {
		type: String,
		required: true,
		ref: 'Project'
	},
	billLines: [BillLineSchema],
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

exports.Bill = BillModel;