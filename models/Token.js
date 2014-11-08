var mongoose = require('mongoose');
var Db = require('./Db.js').Db;

var TokenSchema = new mongoose.Schema({
	key: String,
	_user: {
		type: String,
		required: true,
		ref: 'User'
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

TokenSchema.methods.hasExpired = function() {
	var now = new Date();
	var dateToBeChecked = created;
	if (updated) {
		dateToBeChecked = updated;
	}
	return (now - dateToBeChecked) > 7; //token is a week old
};

var TokenModel = Db.model('Token', TokenSchema);

exports.Token = TokenModel;