userModule.controller('EditUserController', ['$scope', '$q', '$routeParams', '$rootScope', '$global', '$timeout', '$location', 'UserService', 'RoleService', 'UsersProjectService', 'ProjectService',
	function($scope, $q, $routeParams, $rootScope, $global, $timeout, $location, UserService, RoleService, UsersProjectService, ProjectService) {
		var userId = $routeParams.id;

		//Declare useful variables
		$scope.administratingProjects = [];
		$scope.notAdministratingProjects = [];

		var administratingProjectsNew = [];
		var notAdministratingProjectsNew = [];

		var userInit = {};

		//Create our first deferred object which will get our user
		var firstDeferred = $q.defer();
		var promise = firstDeferred.promise;

		UserService.get(userId).success(function(data) {
			if (data.success) {
				firstDeferred.resolve(data);
			} else {
				firstDeferred.reject(data);
			}
		});

		$scope.administratingThisProject = function(index) {
			$scope.administratingProjects.push($scope.notAdministratingProjects[index]);
			administratingProjectsNew.push($scope.notAdministratingProjects[index]);
			deleteObjectFromArray($scope.notAdministratingProjects[index], notAdministratingProjectsNew);
			$scope.notAdministratingProjects.splice(index, 1);
		};

		$scope.notAdministratingThisProject = function(index) {
			$scope.notAdministratingProjects.push($scope.administratingProjects[index]);
			notAdministratingProjectsNew.push($scope.administratingProjects[index]);
			deleteObjectFromArray($scope.administratingProjects[index], administratingProjectsNew);
			$scope.administratingProjects.splice(index, 1);
		};

		deleteObjectFromArray = function(object, array) {
			for (var i = 0; i < array.length; i++) {
				if (array[i] === object) {
					array.splice(i, 1);
					break;
				}
			}
		};

		promise
		//Once we retrieved our user from first promise
			.then(function(first) {
				$scope.user = first.user;
				userInit = jQuery.extend({}, $scope.user);
				//Get the roles, once we've our user
				RoleService.all().success(function(data) {
					$scope.roles = data.roles;
					//Little twik to make things work
					angular.forEach(data.roles, function(role) {
						if (role._id === $scope.user._role._id) {
							$scope.user._role = role;
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
					$scope.notAdministratingProjects = third.projects;
					$scope.administratingProjects = third.projects;

					angular.forEach($scope.usersProjects, function(usersProject) {
						$scope.notAdministratingProjects = $scope.notAdministratingProjects.filter(function(obj) {
							return obj._id !== usersProject._project._id;
						});
					});
					angular.forEach($scope.notAdministratingProjects, function(project) {
						$scope.administratingProjects = $scope.administratingProjects.filter(function(obj) {
							return obj._id !== project._id;
						});
					});
					//Else we set the notAdministratingProjects as all of the projects and the other one is empty
				} else {
					$scope.notAdministratingProjects = third.projects;
					$scope.administratingProjects = [];
				}
			})
			.catch(function(error) {
				console.log(error);
			});


		$scope.saveUser = function() {
			//Because we're using the same template for add and edit
			$scope.userToSave = jQuery.extend({}, $scope.user);
			$scope.user.password = '';
			$scope.passwordRepeat = '';
			$scope.userToSave._role = $scope.userToSave._role._id;

			UserService.put($scope.user).success(function(data) {
				console.log(data);
				if (data.success) {
					//If his role changed from administrator to another, delete his usersProjects
					if ((userInit._role._id !== data.user._role) && (userInit._role.name === "administrator") && ($scope.usersProjects.length > 0)) {
						angular.forEach($scope.usersProjects, function(project) {
							UsersProjectService.deleteByUserAndProject($scope.userToSave._id, project._project._id).success(function(data) {
								console.log(data);
							});
						});
					} else {
						angular.forEach(administratingProjectsNew, function(project) {
							UsersProjectService.post({
								_user: $scope.userToSave._id,
								_project: project._id
							}).success(function(data) {
								console.log(data);
							});
						});

						angular.forEach(notAdministratingProjectsNew, function(project) {
							UsersProjectService.deleteByUserAndProject($scope.userToSave._id, project._id).success(function(data) {
								console.log(data);
							});
						});
					}
					$location.path('/users');
				}
			});
		};
	}
]);