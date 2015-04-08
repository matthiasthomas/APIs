userModule.controller('EditRoleController', ['$scope', 'RoleService', 'ProjectService', 'UserService', 'ModelService', '$routeParams', '$location', 'localStorageService',
	function($scope, RoleService, ProjectService, UserService, ModelService, $routeParams, $location, localStorageService) {
		var roleId = $routeParams.id;
		var permissions = [];
		var projects = [];
		$scope.role = {
			name: "",
			permissions: [],
			projects: []
		};

		$scope.isSuperhero = false;
		if (RoleService.hasRole(localStorageService.get('activeUser'), 'superhero')) {
			$scope.isSuperhero = true;
		}

		async.parallel({
			getProjects: function(callback) {
				ProjectService.all().success(function(data) {
					if (!data.success) return callback(data);
					callback(null, data.projects);
				});
			},
			getRole: function(callback) {
				RoleService.get(roleId).success(function(data) {
					if (!data.success) return callback(data);
					callback(null, data.role);
				});
			},
			getModels: function(callback) {
				ModelService.all().success(function(data) {
					if (!data.success) return callback(data);
					callback(null, data.models);
				});
			},
		}, function(error, results) {
			$scope.role._id = results.getRole._id;
			$scope.role.name = results.getRole.name;
			permissions = results.getRole.permissions;
			projects = results.getRole.projects;
			results.getProjects.forEach(function(project) {
				$scope.role.projects.push({
					_id: project._id,
					name: project.name,
					checked: false
				});
			});
			$scope.role.projects.forEach(function(project) {
				projects.forEach(function(roleProject) {
					if (roleProject._id == project._id) {
						project.checked = true;
					}
				});
			});
			$scope.models = results.getModels;
			$scope.models.forEach(function(model) {
				$scope.role.permissions.push({
					subject: model.name,
					actions: [{
						name: 'create',
						checked: false
					}, {
						name: 'read',
						checked: false
					}, {
						name: 'update',
						checked: false
					}, {
						name: 'delete',
						checked: false
					}]
				});
			});
			$scope.role.permissions.forEach(function(rolePermission) {
				permissions.forEach(function(permission) {
					if (rolePermission.subject == permission.subject) {
						rolePermission.actions.forEach(function(action) {
							if (action.name == permission.action) {
								action.checked = true;
							}
						});
					}
				});
			});
		});

		$scope.checked = false;

		$scope.saveRole = function() {
			var permissionsArray = [];
			$scope.role.projects = $scope.role.projects.filter(function(project) {
				return (project.checked);
			});
			// Now loop through the permissions of our role
			$scope.role.permissions.forEach(function(permission) {
				// Loop thourhg the actions of the permission
				permission.actions.forEach(function(action) {
					//If one of this actions is checked
					if (action.checked) {
						permissionsArray.push({
							subject: permission.subject,
							action: action.name
						});
					}
				});
			});
			$scope.role.permissions = permissionsArray;
			RoleService.put($scope.role._id, $scope.role).success(function(data) {
				if (data.success) {
					$location.path("/roles");
				} else {
					console.log(data);
				}
			});
		};

		$scope.checkOrUncheck = function() {
			var aCheckboxIsChecked = false;
			$scope.role.permissions.forEach(function(permission) {
				permission.actions.forEach(function(action) {
					if (action.checked) {
						aCheckboxIsChecked = true;
					}
				});
			});
			if (aCheckboxIsChecked) {
				$scope.checked = true;
			} else {
				$scope.checked = false;
			}
		};

		$scope.checkAll = function() {
			var aCheckboxIsChecked = false;
			$scope.role.permissions.forEach(function(permission) {
				permission.actions.forEach(function(action) {
					if (action.checked) {
						aCheckboxIsChecked = true;
					}
				});
			});

			if (aCheckboxIsChecked) {
				$scope.role.permissions.forEach(function(permission) {
					permission.actions.forEach(function(action) {
						action.checked = false;
					});
				});
				$scope.checked = false;
			} else {
				$scope.role.permissions.forEach(function(permission) {
					permission.actions.forEach(function(action) {
						action.checked = true;
					});
				});
				$scope.checked = true;
			}
		};
	}
]);