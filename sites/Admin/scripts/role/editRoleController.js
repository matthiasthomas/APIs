userModule.controller('EditRoleController', ['$scope', 'RoleService', 'ModelService', '$routeParams', '$location',
	function($scope, RoleService, ModelService, $routeParams, $location) {
		var roleId = $routeParams.id;
		var permissions = [];
		$scope.role = {
			name: "",
			permissions: []
		};

		RoleService.get(roleId).success(function(data) {
			if (data.success) {
				$scope.role._id = data.role._id;
				$scope.role.name = data.role.name;
				permissions = data.role.permissions;

				ModelService.all().success(function(data) {
					if (data.success) {
						$scope.models = data.models;
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

						var filteredArray = [];
						console.log($scope.role);
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
					} else {
						console.log(data);
					}
				});
			} else {
				console.log(data);
			}
		});

		$scope.checked = false;

		$scope.saveRole = function() {
			var permissionsArray = [];
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