var mongoose = require('mongoose');
var Db = require('./Db.js').Db;

var BillModel = Db.model('Bill', new mongoose.Schema({
	_project: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Project'
	},
	billLines: [{
		label: String,
		details: String,
		cost: Number,
		quantity: Number
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

exports.Bill = BillModel;