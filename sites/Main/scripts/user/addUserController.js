userModule.controller('AddUserController', ['$scope', '$routeParams', '$rootScope', '$global', '$timeout', '$location', 'UserService', 'RoleService', 'UsersProjectService', 'ProjectService',
	function($scope, $routeParams, $rootScope, $global, $timeout, $location, UserService, RoleService, UsersProjectService, ProjectService) {
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
			$scope.roles = data;
		});

		$scope.administratingThisProject = function(index) {
			$scope.administratingProjects.push($scope.notAdministratingProjects[index]);
			$scope.notAdministratingProjects.splice(index, 1);
		};

		$scope.notAdministratingThisProject = function(index) {
			$scope.notAdministratingProjects.push($scope.administratingProjects[index]);
			$scope.administratingProjects.splice(index, 1);
		};
	}
]);