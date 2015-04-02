var mongoose = require('mongoose'),
  async = require('async');
var Role = require('./models/Role.js').Role;
var UsersProject = require('./models/UsersProject.js').UsersProject;
var Project = require('./models/Project.js').Project;

function resolveRole(role, done) {
  if (typeof role === 'string') {
    Role.findOne({
      name: role
    }, function(err, role) {
      if (err) return done(err);
      if (!role) return done(new Error("Unknown role"));
      done(null, role);
    });
  } else {
    done(null, role);
  }
}

function resolveProject(project, done) {
  if (typeof project === 'string') {
    Project.findOne({
      name: project
    }, function(error, project) {
      if (error) return done(error);
      if (!project) return done(new Error("Unknown project"));
      done(null, project);
    });
  } else {
    done(null, project);
  }
}

function plugin(schema, options) {
  options || (options = {});

  schema.add({
    roles: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role'
    }]
  });

  // Added by Matthias 12/02/2015
  schema.methods.hasAccess = function(project, done) {
    var obj = this;
    //If he is a superhero he can access any project he wants
    obj.hasRole('superhero', function(error, success){
      if(error) return done(error);
      if(success) return done(null, success);

      resolveProject(project, function(error, project) {
        UsersProject.find({
          _project: project._id,
          _user: obj._id,
          archived: false
        }, function(error, usersProject) {
          if (error) return done(error, false);
          if (usersProject.length === 0) return done(null, false);

          return done(null, true);
        });
      });
    });
  };
  // End Added

  schema.methods.hasRole = function(role, done) {
    var obj = this;
    resolveRole(role, function(err, role) {
      if (err) return done(err);
      var hasRole = false;
      obj.roles.forEach(function(existing) {
        if ((existing._id && existing._id.equals(role._id)) ||
          (existing.toString() === role.id)) {
          hasRole = true;
        }
      });
      done(null, hasRole);
    });
  };

  schema.methods.addRole = function(role, done) {
    var obj = this;
    resolveRole(role, function(err, role) {
      if (err) return done(err);
      obj.hasRole(role, function(err, has) {
        if (err) return done(err);
        if (has) return done(null, obj);
        obj.roles = [role._id].concat(obj.roles);
        obj.save(done);
      });
    });
  };

  schema.methods.removeRole = function(role, done) {
    var obj = this;
    resolveRole(role, function(err, role) {
      obj.hasRole(role.name, function(err, has) {
        if (err) return done(err);
        if (!has) return done(null);
        var index = obj.roles.indexOf(role._id);
        obj.roles.splice(index, 1);
        obj.save(done);
      });
    });
  };

  schema.methods.can = function(action, subject, done) {
    var obj = this;
    obj.populate('roles', function(err, obj) {
      if (err) return done(err);
      var hasPerm = false;
      if (obj.roles) {
        async.forEachSeries(obj.roles, function(role, next) {
          role.can(action, subject, function(err, has) {
            if (err) return next(err);
            if (has) hasPerm = true;
            next();
          });
        }, function(err) {
          done(err, hasPerm);
        });
      } else {
        done(null, hasPerm);
      }
    });
  };

  schema.methods.canAll = function(actionsAndSubjects, done) {
    var obj = this;
    obj.populate('roles', function(err, obj) {
      if (err) return done(err);
      var count = 0,
        hasAll = false;
      if (obj.roles) {
        async.forEachSeries(actionsAndSubjects, function(as, nextPerm) {
          var found = false;
          async.forEachSeries(obj.roles, function(role, nextRole) {
            role.can(as[0], as[1], function(err, has) {
              if (err) return nextRole(err);
              if (!found && has) {
                found = true;
                count++;
              }
              nextRole();
            });
          }, function(err) {
            nextPerm(err);
          });
        }, function(err) {
          hasAll = (count === actionsAndSubjects.length);
          done(err, hasAll);
        });
      } else {
        done(null, hasAll);
      }
    });
  };

  schema.methods.canAny = function(actionsAndSubjects, done) {
    var obj = this;
    obj.populate('roles', function(err, obj) {
      if (err) return done(err);
      var hasAny = false;
      if (obj.roles) {
        var iter = 0;
        async.until(
          function() {
            return hasAny || iter === obj.roles.length;
          },
          function(callback) {
            obj.roles[iter].canAny(actionsAndSubjects, function(err, has) {
              if (err) return callback(err);
              if (has) hasAny = true;
              iter++;
              callback();
            });
          },
          function(err) {
            done(err, hasAny);
          });
      } else {
        done(null, hasAny);
      }
    });
  };
}

function init(roleModel, permissionModel, rolesAndPermissions, done) {
  var count = Object.keys(rolesAndPermissions).length,
    roles = [],
    promise = new mongoose.Promise(done);
  for (var name in rolesAndPermissions) {
    var len, role;
    // Convert [action, subject] arrays to objects
    len = rolesAndPermissions[name].length;
    for (var i = 0; i < len; i++) {
      if (Array.isArray(rolesAndPermissions[name][i])) {
        rolesAndPermissions[name][i] = {
          action: rolesAndPermissions[name][i][0],
          subject: rolesAndPermissions[name][i][1]
        };
      }
    }
    // Create role
    role = new roleModel({
      name: name
    });
    roles.push(role);
    role.save(function(err, role) {
      if (err) return promise.error(err);
      // Create role's permissions if they do not exist
      permissionModel.findOrCreate(rolesAndPermissions[role.name], function(err) {
        if (err) return promise.error(err);
        // Add permissions to role
        role.permissions = Array.prototype.slice.call(arguments, 1);
        // Save role
        role.save(function(err) {
          if (err) return promise.error(err);
          --count || done.apply(null, [err].concat(roles));
        });
      });
    });
  }
}

module.exports.plugin = plugin;
module.exports.init = init;
