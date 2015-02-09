var mongoose = require('mongoose');
var Db = require('./Db.js').Db;
var CAN_ALL = 'all';
var CAN_ANY = 'any';

//__________________________________________________________________//
//_______________________Role Schema declaration____________________//
//__________________________________________________________________//

var RoleSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	displayName: String,
	description: String,
	permissions: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Permission'
	}],
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

//__________________________________________________________________//
//____________________Role Schema Functions___________________//
//__________________________________________________________________//

function doCan(type, actionsAndSubjects, done) {
	var role = this;
	role.populate('permissions', function(err, role) {
		if (err) return done(err);
		var count = 0,
			hasAll = false;
		if (role.permissions) {
			actionsAndSubjects.forEach(function(as) {
				var has = false;
				role.permissions.forEach(function(p) {
					if (p.action === as[0] && p.subject === as[1]) has = true;
				});
				if (has) count++;
			});
		}
		if (type === CAN_ANY) {
			hasAll = (count > 0);
		} else {
			hasAll = (count === actionsAndSubjects.length);
		}
		done(null, hasAll);
	});
}

RoleSchema.methods.can = function(action, subject, done) {
	Db.model('Role').findById(this._id, function(err, role) {
		if (err) return done(err);
		doCan.call(role, CAN_ALL, [
			[action, subject]
		], done);
	});
};

RoleSchema.methods.canAll = function(actionsAndSubjects, done) {
	Db.model('Role').findById(this._id, function(err, role) {
		if (err) return done(err);
		doCan.call(role, CAN_ALL, actionsAndSubjects, done);
	});
};

RoleSchema.methods.canAny = function(actionsAndSubjects, done) {
	Db.model('Role').findById(this._id, function(err, role) {
		if (err) return done(err);
		doCan.call(role, CAN_ANY, actionsAndSubjects, done);
	});
};

RoleSchema.pre('save', function(done) {
	var that = this;
	Db.model('Role').findOne({
		name: that.name
	}, function(err, role) {
		if (err) {
			done(err);
		} else if (role && !(role._id.equals(that._id))) {
			that.invalidate('name', 'name must be unique');
			done(new Error('Role name must be unique'));
		} else {
			done();
		}
	});
});

//__________________________________________________________________//
//______________________Role Model Declaration______________________//
//__________________________________________________________________//

var RoleModel = Db.model('Role', RoleSchema);

exports.Role = RoleModel;