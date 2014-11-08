var mongoose = require('mongoose');
var Db = require('./Db.js').Db;

//A contact can have many phones
var PhoneSchema = new mongoose.Schema({
	number: String,
	type: String,
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

//A project can have many contacts
var ContactSchema = new mongoose.Schema({
	label: String,
	address: String,
	city: String,
	zipcode: String,
	country: String,
	phones: [PhoneSchema],
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

var ProjectModel = Db.model('Project', new mongoose.Schema({
	name: String,
	contacts: [ContactSchema],
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

exports.Project = ProjectModel;