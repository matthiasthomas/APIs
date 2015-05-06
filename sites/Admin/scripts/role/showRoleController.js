roleModule.controller('ShowRoleController', ['$scope', 'RoleService', 'UserService', '$routeParams',
	function($scope, RoleService, UserService, $routeParams) {
		var roleId = $routeParams.id;
		var permissions = [];

		$scope.activeUser = UserService.activeUser();
		$scope.hasRole = function(user, role) {
			return RoleService.hasRole(user, role);
		};

		RoleService.get(roleId).success(function(data) {
			if (data.success) {
				// Loop once for the subjects
				data.role.permissions.forEach(function(permission) {
					var count = 0;
					permissions.forEach(function(permission2) {
						if (permission2.subject == permission.subject) {
							count++;
						}
					});
					if (count < 1) {
						permissions.push({
							subject: permission.subject,
							actions: []
						});
					}
				});
				// Loop a second time for the actions
				data.role.permissions.forEach(function(permissionToPush) {
					permissions.forEach(function(permission) {
						if (permissionToPush.subject == permission.subject) {
							permission.actions.push(permissionToPush.action);
						}
					});
				});
				$scope.role = data.role;
				$scope.role.permissions = permissions;
			} else {
				console.log(data);
			}
		});
	}
]);