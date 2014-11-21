userModule.controller('UsersController', ['$scope', '$rootScope', '$global', '$timeout', '$location', 'UserService', 'RoleService',
	function($scope, $rootScope, $global, $timeout, $location, UserService, RoleService) {
		UserService.all().success(function(data) {
			$scope.users = data.users;
		});

		RoleService.all().success(function(data) {
			$scope.roles = data.roles;
		});

		$scope.deleteUser = function(id) {
			
			UserService.delete(id).success(function(data) {
				if (data.success) {
					$scope.users = $scope.users.filter(function(user) {
						return user._id !== id;
					});
				}
				console.log(data);
			});
		};
	}
]);