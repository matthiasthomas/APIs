userModule.controller('AddUserController', ['$scope', '$q', '$routeParams', '$rootScope', '$global', '$timeout', '$location', 'UserService', 'RoleService', 'UsersProjectService', 'ProjectService',
	function($scope, $q, $routeParams, $rootScope, $global, $timeout, $location, UserService, RoleService, UsersProjectService, ProjectService) {
		$scope.user = {
			email: '',
			password: ''
		};

		$scope.administratingProjects = [];
		$scope.notAdministratingProjects = [];

		ProjectService.all().success(function(data) {
			$scope.projects = data.projects;
			$scope.notAdministratingProjects = $scope.projects;
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
			console.log($scope.user);
			UserService.register($scope.user).success(function(data) {
				console.log(data);
				if (data.success) {
					//Theere is no administrating projects
					if ($scope.administratingProjects.length > 0) {
						var deferred = $q.defer();
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
			});
		};
	}
]);