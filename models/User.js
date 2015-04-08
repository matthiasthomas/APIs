var mongoose = require('mongoose');
var permissionManager = require('../permissionManager.js');
var Db = require('./Db.js').Db;

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
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

UserSchema.pre('save', function(done) {
	var that = this;
	Db.model('User').findOne({
		email: that.email,
		archived: false
	}, function(error, user) {
		if (error) {
			done(error);
		} else if (user && !(user._id.equals(that._id))) {
			that.invalidate('name', 'name must be unique');
			done(new Error('Role name must be unique'));
		} else {
			done();
		}
	});
});

//To perform role base access control on routes
UserSchema.plugin(permissionManager.plugin);

var UserModel = Db.model('User', UserSchema);

exports.User = UserModel;