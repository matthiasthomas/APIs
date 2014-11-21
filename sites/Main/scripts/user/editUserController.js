userModule.controller('EditUserController', ['$scope', '$q', '$routeParams', '$rootScope', '$global', '$timeout', '$location', 'UserService', 'RoleService', 'UsersProjectService', 'ProjectService',
	function($scope, $q, $routeParams, $rootScope, $global, $timeout, $location, UserService, RoleService, UsersProjectService, ProjectService) {
		var userId = $routeParams.id;

		$scope.administratingProjectsInit = [];
		$scope.notAdministratingProjectsInit = [];

		$scope.administratingProjects = [];
		$scope.notAdministratingProjects = [];

		var firstDeferred = $q.defer();
		var promise = firstDeferred.promise;

		UserService.get(userId).success(function(data) {
			if (data.success) {
				firstDeferred.resolve(data);
			} else {
				firstDeferred.reject(data);
			}
		});

		promise
		//Once we retrieved our user from first promise
			.then(function(first) {
				console.log(first);
				$scope.user = first.user;
				var secondDeferred = $q.defer();
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
				console.log(second);
				$scope.usersProjects = second.usersProjects;
				var thirdDeferred = $q.defer();
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
				console.log(third);

				if ($scope.usersProjects.length > 0) {
					$scope.notAdministratingProjectsInit = third.projects;
					$scope.administratingProjectsInit = third.projects;

					angular.forEach($scope.usersProjects, function(usersProject) {
						$scope.notAdministratingProjectsInit = $scope.notAdministratingProjectsInit.filter(function(obj) {
							return obj._id !== usersProject._project;
						});
					});
					angular.forEach($scope.notAdministratingProjectsInit, function(project) {
						$scope.administratingProjects = $scope.administratingProjectsInit.filter(function(obj) {
							return obj._id !== project._id;
						});
					});
				} else {
					$scope.notAdministratingProjectsInit = third.projects;
					$scope.administratingProjectsInit = [];
				}
				//Keep an init version to compare before saving user 
				$scope.notAdministratingProjects = $scope.notAdministratingProjectsInit;
				$scope.administratingProjects = $scope.administratingProjectsInit;
			})
			.catch(function(error) {
				console.log(error);
			});

		RoleService.all().success(function(data) {
			$scope.roles = data.roles;
		});

		$scope.administratingThisProject = function(index) {
			$scope.administratingProjects.push($scope.notAdministratingProjects[index]);
			$scope.notAdministratingProjects.splice(index, 1);
		};

		$scope.notAdministratingThisProject = function(index) {
			$scope.notAdministratingProjects.push($scope.administratingProjects[index]);
			$scope.administratingProjects.splice(index, 1);
		};

		$scope.saveUser = function() {
			//Because we're using the same template for add and edit
			$scope.user._role = $scope.user._role._id;
			var firstDeferred = $q.defer();
			var promise = deferred.promise;

			UserService.put($scope.user).success(function(data) {
				if (data.success) {
					deferred.resolve();
				} else {
					deferred.reject();
				}
			});

			promise
				.then(function(first) {
					var secondDeferred = $q.defer();



					return secondDeferred.promise;
				})
				.then(function(second) {

				})
				.catch(function(error) {

				});

			/*UserService.put($scope.user).success(function(data) {
				if (data.success) {
					if ($scope.notAdministratingProjects.length > 0) {
						angular.forEach($scope.notAdministratingProjects, function(project) {
							UsersProjectService.deleteByUserAndProject(data.user._id, project._id).success(function(data) {
								console.log(data);
							});
						});
					}
					//Theere is no administrating projects
					if ($scope.administratingProjects.length > 0) {
						angular.forEach($scope.administratingProjects, function(project) {
							UsersProjectService.post({
								_project: project._id,
								_user: data.user._id
							}).success(function(data) {
								console.log(data);
							});
						});
						$location.path('/users');
						//redirect directly
					} else {
						$location.path('/users');
					}
				} else {
					console.log(data.message);
				}
			});*/
		};
	}
]);