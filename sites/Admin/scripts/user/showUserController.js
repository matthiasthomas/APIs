userModule.controller('ShowUserController', ['$scope', '$q', 'UserService', 'RoleService', '$routeParams',
	function($scope, $q, UserService, RoleService, $routeParams, ProjectService) {
		var userId = $routeParams.id;
		$scope.isSuperhero = false;

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