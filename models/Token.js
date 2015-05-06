var mongoose = require('mongoose');
var Db = require('./Db.js').Db;

var TokenSchema = new mongoose.Schema({
	key: String,
	_user: {
		type: mongoose.Schema.Types.ObjectId,
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
	var dateToBeChecked = this.created;
	if (this.updated) {
		dateToBeChecked = this.updated;
	}
	return (now - dateToBeChecked) > 1 * 3600 * 1000; //token is 1h old
};

var TokenModel = Db.model('Token', TokenSchema);

exports.Token = TokenModel;