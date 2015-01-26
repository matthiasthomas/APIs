userModule.controller('EditRoleController', ['$scope', 'RoleService',
	function($scope, RoleService) {
		var roleId = $routeParams.id;

		RoleService.get(roleId).success(function(data) {
			console.log(data);
		});

		$scope.role = {};
		$scope.role.name = '';
		$scope.role.permissions = [];
		$scope.addPermission();

		$scope.saveRole = function() {
			RoleService.post(roleId, $scope.role).success(function(data) {
				console.log(data);
			});
		};

		$scope.addPermission = function() {
			$scope.role.permissions.push({
				subject: '',
				action: ''
			});
		};

		$scope.deletePermission = function(index) {
			$scope.role.permissions.splice(index, 1);
		};
	}
]);