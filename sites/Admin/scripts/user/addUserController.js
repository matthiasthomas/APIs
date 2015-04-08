userModule.controller('AddUserController', ['$scope', '$q', '$routeParams', '$rootScope', '$global', '$timeout', '$location', 'UserService', 'RoleService', 'ProjectService', 'localStorageService',
	function($scope, $q, $routeParams, $rootScope, $global, $timeout, $location, UserService, RoleService, ProjectService, localStorageService) {
		$scope.user = {
			email: '',
			password: ''
		};

		if (localStorageService.get('activeUser') && !$scope.activeUser) {
			$scope.activeUser = localStorageService.get('activeUser');
		}

		$scope.projectsUserHasAccessTo = [];
		$scope.projectsUserHasNotAccessTo = [];
		$scope.rolesUserHas = [];
		$scope.rolesUserHasNot = [];

		ProjectService.all().success(function(data) {
			$scope.projects = data.projects;
			$scope.projectsUserHasNotAccessTo = $scope.projects;
		});

		RoleService.all().success(function(data) {
			if (!RoleService.hasRole($rootScope.activeUser, 'superhero')) {
				data.roles = data.roles.filter(function(element) {
					return (element.name !== 'superhero');
				});
			}
			$scope.roles = data.roles;
			$scope.rolesUserHasNot = $scope.roles;
		});

		$scope.addRole = function(index) {
			$scope.rolesUserHas.push($scope.rolesUserHasNot[index]);
			$scope.rolesUserHasNot.splice(index, 1);
		};

		$scope.removeRole = function(index) {
			$scope.rolesUserHasNot.push($scope.rolesUserHas[index]);
			$scope.rolesUserHas.splice(index, 1);
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
			UserService.register({
				user: $scope.user,
				projects: $scope.projectsUserHasAccessTo,
				roles: $scope.rolesUserHas
			}).success(function(data) {
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