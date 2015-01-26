userModule.controller('AddRoleController', ['$scope', 'RoleService',
	function($scope, RoleService) {
		$scope.role = {};
		$scope.role.name = '';
		$scope.role.permissions = [];

		$scope.addPermission = function() {
			$scope.role.permissions.push({
				subject: '',
				action: ''
			});
		};

		$scope.addPermission();

		$scope.saveRole = function() {
			RoleService.put($scope.role).success(function(data) {
				console.log(data);
			});
		};

		$scope.deletePermission = function(index) {
			$scope.role.permissions.splice(index, 1);
		};
	}
]);