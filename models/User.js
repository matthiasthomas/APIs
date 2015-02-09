var mongoose = require('mongoose');
var permissionManager = require('../permissionManager.js');
var Db = require('./Db.js').Db;

var UserSchema = new mongoose.Schema({
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
});

//To perform role base access control on routes
UserSchema.plugin(permissionManager.plugin);

var UserModel = Db.model('User', UserSchema);

exports.User = UserModel;