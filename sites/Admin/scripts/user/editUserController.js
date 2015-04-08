userModule.controller('EditUserController', ['$scope', '$q', 'localStorageService', '$routeParams', '$rootScope', '$global', '$timeout', '$location', 'UserService', 'RoleService', 'UsersProjectService', 'ProjectService',
	function($scope, $q, localStorageService, $routeParams, $rootScope, $global, $timeout, $location, UserService, RoleService, UsersProjectService, ProjectService) {
		// Get the user id from the route params
		var userId = $routeParams.id;

		if (localStorageService.get('activeUser') && !$rootScope.activeUser) {
			$rootScope.activeUser = localStorageService.get('activeUser');
		}

		//Declare useful variables
		$scope.projectsUserHasAccessTo = [];
		$scope.projectsUserHasNotAccessTo = [];

		var projectsUserHasAccessToNew = [];
		var projectsUserHasNotAccessToNew = [];

		var userInit = {};
		$scope.rolesHeHas = [];
		$scope.rolesHeHasnt = [];

		//Create our first deferred object which will get our user
		var firstDeferred = $q.defer();
		var promise = firstDeferred.promise;

		// Get the user from its user id
		UserService.get(userId).success(function(data) {
			if (data.success) {
				// then go the promise.then
				firstDeferred.resolve(data);
			} else {
				firstDeferred.reject(data);
			}
		});

		$scope.addAccessToThisProject = function(index) {
			$scope.projectsUserHasAccessTo.push($scope.projectsUserHasNotAccessTo[index]);
			projectsUserHasAccessToNew.push($scope.projectsUserHasNotAccessTo[index]);
			deleteObjectFromArray($scope.projectsUserHasNotAccessTo[index], projectsUserHasNotAccessToNew);
			$scope.projectsUserHasNotAccessTo.splice(index, 1);
		};

		$scope.removeAccessToThisProject = function(index) {
			$scope.projectsUserHasNotAccessTo.push($scope.projectsUserHasAccessTo[index]);
			projectsUserHasNotAccessToNew.push($scope.projectsUserHasAccessTo[index]);
			deleteObjectFromArray($scope.projectsUserHasAccessTo[index], projectsUserHasAccessToNew);
			$scope.projectsUserHasAccessTo.splice(index, 1);
		};

		deleteObjectFromArray = function(object, array) {
			for (var i = 0; i < array.length; i++) {
				if (array[i] === object) {
					array.splice(i, 1);
					break;
				}
			}
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

		promise
		//Once we retrieved our user from first promise
			.then(function(first) {
				$scope.user = first.user;

				//A user cannot update an admin unless he is superhero, or that he is trying to update himself
				if ((hasRole($scope.user, 'administrator')) && (!hasRole($rootScope.activeUser, 'superhero')) && $rootScope.activeUser._id !== $scope.user._id) {
					$location.path('/users');
					return;
				}

				// copy the user
				userInit = jQuery.extend({}, $scope.user);
				//Get the roles, once we've our user
				RoleService.all().success(function(data) {
					var userHasRole;
					data.roles.forEach(function(role) {
						if (hasRole($scope.user, role.name)) {
							$scope.rolesHeHas.push(role);
						} else {
							$scope.rolesHeHasnt.push(role);
						}
					});
				});
				var secondDeferred = $q.defer();
				//Create our second deferred which will get usersProjects for active user
				UsersProjectService.getByUser($scope.user._id).success(function(data) {
					if (data.success) {
						secondDeferred.resolve(data);
					} else {
						secondDeferred.reject(data);
					}
				});
				return secondDeferred.promise;
			})
			//Once we retrieved our user's projects from second promise
			.then(function(second) {
				//Set usersProjects
				$scope.usersProjects = second.usersProjects;
				var thirdDeferred = $q.defer();
				//Create our third deferred which will get all projects
				ProjectService.all().success(function(data) {
					if (data.success) {
						thirdDeferred.resolve(data);
					} else {
						thirdDeferred.reject(data);
					}
				});
				return thirdDeferred.promise;
			})
			//Once we retrieved our projects from third promise
			.then(function(third) {
				//If our user has projects
				if ($scope.usersProjects.length > 0) {
					$scope.projectsUserHasNotAccessTo = third.projects;
					$scope.projectsUserHasAccessTo = third.projects;

					angular.forEach($scope.usersProjects, function(usersProject) {
						$scope.projectsUserHasNotAccessTo = $scope.projectsUserHasNotAccessTo.filter(function(obj) {
							return obj._id !== usersProject._project._id;
						});
					});
					angular.forEach($scope.projectsUserHasNotAccessTo, function(project) {
						$scope.projectsUserHasAccessTo = $scope.projectsUserHasAccessTo.filter(function(obj) {
							return obj._id !== project._id;
						});
					});
					//Else we set the projectsUserHasNotAccessTo as all of the projects and the other one is empty
				} else {
					$scope.projectsUserHasNotAccessTo = third.projects;
					$scope.projectsUserHasAccessTo = [];
				}
			})
			.catch(function(error) {
				console.log(error);
			});


		$scope.test = function() {
			console.log($scope.usersRoles);
		};

		$scope.saveUser = function() {
			//Because we're using the same template for add and edit

			$scope.user.roles = [];
			$scope.rolesHeHas.forEach(function(role) {
				$scope.user.roles.push(role._id);
			});

			console.log($scope.user);

			UserService.put($scope.user).success(function(data) {
				if (data.success) {
					angular.forEach(projectsUserHasAccessToNew, function(project) {
						UsersProjectService.post({
							_user: $scope.user._id,
							_project: project._id
						}).success(function(data) {
							console.log(data);
						});
					});

					angular.forEach(projectsUserHasNotAccessToNew, function(project) {
						UsersProjectService.deleteByUserAndProject($scope.user._id, project._id).success(function(data) {
							console.log(data);
						});
					});
					$location.path('/users');
				} else {
					console.log(data.message);
				}
			});
		};
	}
]);