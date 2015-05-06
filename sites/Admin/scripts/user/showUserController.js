userModule.controller('ShowUserController', ['$scope', '$q', 'UserService', 'RoleService', '$routeParams',
	function($scope, $q, UserService, RoleService, $routeParams, ProjectService) {
		var userId = $routeParams.id;
		$scope.isSuperhero = false;
		$scope.activeUser = UserService.activeUser();
		$scope.hasRole = function(user, role) {
			return RoleService.hasRole(user, role);
		};

		//Get the user
		UserService.get(userId).success(function(data) {
			if (data.success) {
				$scope.user = data.user;
				if (RoleService.hasRole($scope.user, 'superhero')) {
					$scope.isSuperhero = true;
				}
			} else {
				console.log(data);
			}
		});
	}
]);