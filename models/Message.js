var mongoose = require('mongoose');
var Db = require('./Db.js').Db;

var MessageModel = Db.model('Message', new mongoose.Schema({
	_user: {
		type: String,
		required: true,
		ref: 'User'
	},
	subject: String,
	content: String,
	read: {
		type: Boolean,
		default: false
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

exports.Message = MessageModel;