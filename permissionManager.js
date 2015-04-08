var mongoose = require('mongoose'),
  async = require('async');
var Role = require('./models/Role.js').Role;
var Project = require('./models/Project.js').Project;
var Permission = require('./models/Permission.js');

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

  schema.add({
    projects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    }]
  });

  schema.methods.hasAccess = function(project, done) {
    var obj = this;
    obj.hasRole('superhero', function(error, success) {
      if (error) return done(error);
      if (success) return done(null, true);

      resolveProject(project, function(err, project) {
        if (err) return done(err);
        var hasAccess = false;
        obj.projects.forEach(function(existing) {
          if ((existing._id && existing._id.equals(project._id)) ||
            (existing.toString() === project._id)) {
            hasAccess = true;
          }
        });
        done(null, hasAccess);
      });
    });
  };

  schema.methods.hasAccessToAll = function(projects, done) {
    var obj = this;
    var hasAccess = false,
      count = 0;

    async.forEachSeries(projects, function(project, next) {
      obj.hasAccess(project, function(error, success) {
        if (error) next(error);
        if (success) count++;
        next();
      });
    }, function(error) {
      if (error) done(error);
      hasAccess = (count === projects.length);
      done(null, hasAccess);
    });
  };

  schema.methods.hasAccessToAny = function(projects, done) {
    var obj = this;
    var hasAccess = false,
      count = 0;

    async.forEachSeries(projects, function(project, next) {
      obj.hasAccess(project, function(error, success) {
        if (error) next(error);
        if (success) count++;
        next();
      });
    }, function(error) {
      if (error) done(error);
      hasAccess = (count > 0);
      done(null, hasAccess);
    });
  };

  schema.methods.addAccess = function(project, done) {
    var obj = this;
    resolveProject(project, function(error, project) {
      if (error) return done(error);
      if (!project) return done(new Error("Project not found! Can't remove access to unknown project"));
      obj.hasAccess(project, function(error, has) {
        if (error) return done(error);
        if (has) return done(null, obj);
        obj.projects = [project._id].concat(obj.projects);
        obj.save(done);
      });
    });
  };

  schema.methods.removeAccess = function(project, done) {
    var obj = this;
    resolveProject(project, function(error, project) {
      obj.hasAccess(project, function(error, has) {
        if (error) return done(error);
        if (!has) return done(null, obj);
        var index = obj.projects.indexOf(project._id);
        obj.projects.splice(index, 1);
        obj.save(done);
      });
    });
  };

  schema.methods.hasAnyRole = function(roles, done) {
    var obj = this,
      count = 0;

    async.forEachSeries(roles, function(role, next) {
      obj.hasRole(role, function(error, has) {
        if (error) return next(error);
        if (has) count++;
        next();
      });
    }, function(error) {
      done(error, (count > 0));
    });
  };

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
      obj.hasRole(role, function(err, has) {
        if (err) return done(err);
        if (!has) return done(null, obj);
        var index = obj.roles.indexOf(role._id);
        obj.roles.splice(index, 1);
        obj.save(done);
      });
    });
  };

  schema.methods.can = function(action, subject, done) {
    var obj = this;
    obj.hasAnyRole(['superhero', 'administrator'], function(error, success) {
      if (error) return done(error);
      if (success) return done(null, success);

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

function createOrUpdateRole(roleModel, permissionModel, projectModel, role, permissions, projects, done) {
  // If only the name has been passed
  if (typeof role === 'string') {
    role = new roleModel({
      name: role
    });
  }
  role.save(function(error, role) {
    if (error) return done(error);

    async.parallel({
      getPermissions: function(callback) {
        permissionModel.findOrCreate(permissions, function(error, permissions) {
          if (error) return callback(error);
          callback(null, Array.prototype.slice.call(permissions, 0));
        });
      },
      getProjects: function(callback) {
        projectsArray = [];
        async.forEach(projects, function(project, next) {
          projectModel.findById(project._id, function(error, project) {
            if (error) return next(error);
            projectsArray.push(project._id);
            next();
          });
        }, function(error) {
          callback(error, projectsArray);
        });
      }
    }, function(error, results) {
      if (error) return done(error);
      role.permissions = results.getPermissions;
      role.projects = results.getProjects;
      role.save(function(error, role) {
        return done(null, role);
      });
    });
  });
}

function init(rolesAndPermissions, done) {
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
    role = new Role({
      name: name
    });
    roles.push(role);
    role.save(function(err, role) {
      if (err) return promise.error(err);
      // Create role's permissions if they do not exist
      Permission.findOrCreate(rolesAndPermissions[role.name], function(err, permissions) {
        if (err) return promise.error(err);
        // Add permissions to role
        role.permissions = Array.prototype.slice.call(permissions, 0);
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
module.exports.createOrUpdateRole = createOrUpdateRole;