userModule.controller('AddRoleController', ['$scope', '$location', 'RoleService', 'ModelService',
	function($scope, $location, RoleService, ModelService) {
		$scope.role = {
			name: "",
			permissions: []
		};

		$scope.checked = false;

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
			} else {
				console.log(data);
			}
		});

		$scope.saveRole = function() {
			var permissionsArray = [];
			// Now loop through the permissions of our role
			$scope.role.permissions.forEach(function(permission) {
				// Loop thourhg the actions of the permission
				permission.actions.forEach(function(action) {
					//If one of this actions is checked
					if (action.checked) {
						permissionsArray.push([
							action.name,
							permission.subject
						]);
					}
				});
			});
			$scope.role.permissions = permissionsArray;
			RoleService.post($scope.role).success(function(data) {
				if (data.success) {
					$location.path = "/roles";
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