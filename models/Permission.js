var mongoose = require('mongoose');
var Db = require('./Db.js').Db;
var async = require('async');

//__________________________________________________________________//
//____________________Permision Schema declaration__________________//
//__________________________________________________________________//

var PermissionSchema = mongoose.Schema({
	subject: {
		type: String,
		required: true
	},
	action: {
		type: String,
		required: true
	},
	displayName: String,
	description: String
});


//__________________________________________________________________//
//____________________Permission Schema Functions___________________//
//__________________________________________________________________//

PermissionSchema.statics.findOrCreate = function(params, callback) {
	var that = this;

	function findOrCreateOne(params, callback) {
		that.findOne(params, function(err, permission) {
			if (err) return callback(err);
			if (permission) return callback(null, permission);
			that.create(params, callback);
		});
	}

	if (Array.isArray(params)) {
		var permissions = [];
		async.forEachSeries(params, function(param, next) {
			findOrCreateOne(param, function(err, permission) {
				permissions.push(permission);
				next(err);
			});
		}, function(err) {
			callback.apply(null, [err].concat(permissions));
		});
	} else {
		findOrCreateOne(params, callback);
	}
};

//__________________________________________________________________//
//____________________Permission Model Declaration__________________//
//__________________________________________________________________//

var PermissionModel = Db.model('Permission', PermissionSchema);

exports.Permission = PermissionModel;