userModule.controller('EditUserController', ['$scope', '$q', 'localStorageService', '$routeParams', '$rootScope', '$global', '$timeout', '$location', 'UserService', 'RoleService', 'ProjectService',
	function($scope, $q, localStorageService, $routeParams, $rootScope, $global, $timeout, $location, UserService, RoleService, ProjectService) {
		// Get the user id from the route params
		var userId = $routeParams.id;

		$scope.activeUser = UserService.activeUser();

		//Declare useful variables
		$scope.projectsUserHasAccessTo = [];
		$scope.projectsUserHasNotAccessTo = [];

		$scope.rolesHeHas = [];
		$scope.rolesHeHasnt = [];

		// Get the user from its user id
		UserService.get(userId).success(function(data) {
			if (data.success) {
				$scope.user = data.user;
				if (RoleService.hasRole($scope.user, 'superhero')) {
					$scope.isSuperhero = true;
				}

				ProjectService.getForActiveUser().success(function(data) {
					if (data.success) {
						data.projects.forEach(function(project) {
							var found = false;
							$scope.user.projects.forEach(function(userProject) {
								if (userProject._id == project._id) found = true;
							});
							if (found) {
								$scope.projectsUserHasAccessTo.push(project);
							} else {
								$scope.projectsUserHasNotAccessTo.push(project);
							}
						});
					} else {
						console.log(data);
					}
				});

				RoleService.all().success(function(data) {
					if (data.success) {
						data.roles.forEach(function(role) {
							var found = false;
							$scope.user.roles.forEach(function(userRole) {
								if (userRole._id == role._id) {
									found = true;
								}
							});
							if (found) {
								$scope.rolesHeHas.push(role);
							} else {
								$scope.rolesHeHasnt.push(role);
							}
						});
					} else {
						console.log(data);
					}
				});
			} else {
				console.log(data);
			}
		});

		$scope.addAccessToThisProject = function(index) {
			$scope.projectsUserHasAccessTo.push($scope.projectsUserHasNotAccessTo[index]);
			$scope.projectsUserHasNotAccessTo.splice(index, 1);
		};

		$scope.removeAccessToThisProject = function(index) {
			$scope.projectsUserHasNotAccessTo.push($scope.projectsUserHasAccessTo[index]);
			$scope.projectsUserHasAccessTo.splice(index, 1);
		};

		hasRole = function(user, role) {
			var found = false;
			user.roles.forEach(function(userRole) {
				if (userRole.name == role) {
					found = true;
				}
			});
			return found;
		};

		$scope.addRole = function(index) {
			$scope.rolesHeHas.push($scope.rolesHeHasnt[index]);
			$scope.rolesHeHasnt.splice(index, 1);
		};

		$scope.removeRole = function(index) {
			$scope.rolesHeHasnt.push($scope.rolesHeHas[index]);
			$scope.rolesHeHas.splice(index, 1);
		};

		$scope.saveUser = function() {
			//Because we're using the same template for add and edit
			$scope.user.roles = [];
			$scope.rolesHeHas.forEach(function(role) {
				$scope.user.roles.push(role._id);
			});
			$scope.user.projects = [];
			$scope.projectsUserHasAccessTo.forEach(function(project) {
				$scope.user.projects.push(project._id);
			});

			UserService.put($scope.user).success(function(data) {
				if (data.success) {
					$location.path('/users');
				} else {
					console.log(data.message);
				}
			});
		};
	}
]);