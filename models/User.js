var mongoose = require('mongoose');
var Db = require('./Db.js').Db;

var UserModel = Db.model('User', new mongoose.Schema({
	email: String,
	password: {
		type: String
	},
	_role: {
		type: String,
		required: true,
		ref: 'Role'
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

exports.User = UserModel;