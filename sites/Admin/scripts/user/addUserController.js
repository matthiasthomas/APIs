userModule.controller('AddUserController', ['$scope', '$q', '$routeParams', '$rootScope', '$global', '$timeout', '$location', 'UserService', 'RoleService', 'ProjectService', 'localStorageService',
	function($scope, $q, $routeParams, $rootScope, $global, $timeout, $location, UserService, RoleService, ProjectService, localStorageService) {
		$scope.user = {
			email: '',
			password: '',
			projects: [],
			roles: []
		};

		$scope.activeUser = UserService.activeUser();

		$scope.projectsUserHasAccessTo = [];
		$scope.projectsUserHasNotAccessTo = [];
		$scope.rolesHeHas = [];
		$scope.rolesHeHasnt = [];

		ProjectService.getForActiveUser().success(function(data) {
			$scope.projects = data.projects;
			$scope.projectsUserHasNotAccessTo = $scope.projects;
		});

		RoleService.all().success(function(data) {
			if (!RoleService.hasRole(UserService.activeUser(), 'superhero')) {
				data.roles = data.roles.filter(function(element) {
					return (element.name !== 'superhero');
				});
			}
			$scope.roles = data.roles;
			$scope.rolesHeHasnt = $scope.roles;
		});

		$scope.addRole = function(index) {
			$scope.rolesHeHas.push($scope.rolesHeHasnt[index]);
			$scope.rolesHeHasnt.splice(index, 1);
		};

		$scope.removeRole = function(index) {
			$scope.rolesHeHasnt.push($scope.rolesHeHas[index]);
			$scope.rolesHeHas.splice(index, 1);
		};

		$scope.addAccessToThisProject = function(index) {
			$scope.projectsUserHasAccessTo.push($scope.projectsUserHasNotAccessTo[index]);
			$scope.projectsUserHasNotAccessTo.splice(index, 1);
		};

		$scope.removeAccessToThisProject = function(index) {
			$scope.projectsUserHasNotAccessTo.push($scope.projectsUserHasAccessTo[index]);
			$scope.projectsUserHasAccessTo.splice(index, 1);
		};

		$scope.saveUser = function() {
			console.log($scope.user);
			if ($scope.projectsUserHasAccessTo.length === 0) {
				$scope.projectsUserHasAccessTo.push($scope.projectsUserHasNotAccessTo[0]);
			}
			$scope.user.projects = $scope.projectsUserHasAccessTo;
			$scope.user.roles = $scope.rolesHeHas;
			UserService.register($scope.user).success(function(data) {
				console.log(data);
				if (data.success) {
					$location.path('/users');
				} else {
					console.log(data.message);
				}
			});
		};
	}
]);