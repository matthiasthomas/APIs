userModule.controller('RolesController', ['$scope', 'RoleService',
	function($scope, RoleService) {
		RoleService.all().success(function(data) {
			if (data.success) {
				$scope.roles = data.roles;
			} else {
				console.log(data);
			}
		});
	}
]);