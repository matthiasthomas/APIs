roleModule.controller('ShowRoleController', ['$scope', 'RoleService', '$routeParams',
	function($scope, RoleService, $routeParams) {
		var roleId = $routeParams.id;
		var permissions = [];
		RoleService.get(roleId).success(function(data) {
			console.log(data);
			if (data.success) {
				var testArray = [];
				data.role.permissions.forEach(function(permission) {
					testArray = permissions.filter(function(element) {
						return element.subject == permission.subject;
					});
					if (testArray.length > 0) {
						permissions.forEach(function(permission1) {
							if (permission1.subject == permission.subject) {
								permission1.actions.push(permission.action);
							}
						});
					} else {
						permissions.push({
							subject: permission.subject,
							actions:  [permission.action]
						});
					}
				});
				$scope.role = data.role;
				$scope.role.permissions = permissions;
			} else {
				console.log(data);
			}
		});
	}
]);