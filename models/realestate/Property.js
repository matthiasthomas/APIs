var mongoose = require('mongoose');
var Db = require('../Db.js').Db;

var PropertyModel = Db.model('Property', new mongoose.Schema({
	title: String,
	region: {
		title: String,
		latitude: Number,
		longitude: Number
	},
	_propertyType: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "PropertyType"
	},
	rooms: Number,
	bedrooms: Number,
	bathrooms: Number,
	surface: Number,
	price: Number,
	description: String,
	images: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Image'
	}],
	mainImage: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Image'
	},
	projects: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	}],
	views: Number,
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

exports.Property = PropertyModel;