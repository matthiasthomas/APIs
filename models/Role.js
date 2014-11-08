var mongoose = require('mongoose');
var Db = require('./Db.js').Db;

var RoleModel = Db.model('Role', new mongoose.Schema({
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

exports.Role = RoleModel;