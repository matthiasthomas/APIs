userModule.controller('UsersController', ['$scope', '$rootScope', '$global', '$timeout', '$location', 'UserService', 'RoleService', 'localStorageService',
	function($scope, $rootScope, $global, $timeout, $location, UserService, RoleService, localStorageService) {

		if (localStorageService.get('activeUser') && !$rootScope.activeUser) {
			$rootScope.activeUser = localStorageService.get('activeUser');
		}

		UserService.all().success(function(data) {
			if (data.success) {
				$scope.users = data.users;
			} else {
				console.log(data.message);
			}
		});

		$scope.deleteUser = function(id) {
			UserService.delete(id).success(function(data) {
				if (data.success) {
					$scope.users = $scope.users.filter(function(user) {
						return user._id !== id;
					});
				}
			});
		};
	}
]);