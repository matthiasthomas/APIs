userModule.controller('EditUserController', ['$scope', '$routeParams', '$rootScope', '$global', '$timeout', '$location', 'UserService', 'RoleService', 'UsersProjectService',
	function($scope, $routeParams, $rootScope, $global, $timeout, $location, UserService, RoleService, UsersProjectService) {
		var userId = $routeParams.id;
		UserService.get(userId).success(function(data) {
			$scope.user = data;
			UsersProjectService.getByUser($scope.user._id).success(function(data) {
				console.log(data);
				$scope.usersProjects = data;
			});
		});

		RoleService.all().success(function(data) {
			$scope.roles = data;
		});
	}
]);