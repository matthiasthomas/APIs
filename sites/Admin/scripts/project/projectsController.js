projectModule.controller('ProjectsController', ['$scope', '$rootScope', '$global', '$timeout', '$location', 'ProjectService', 'RoleService', 'UserService',
	function($scope, $rootScope, $global, $timeout, $location, ProjectService, RoleService, UserService) {

		$scope.activeUser = UserService.activeUser();
		$scope.hasRole = function(user, role) {
			return RoleService.hasRole(user, role);
		};

		ProjectService.getForActiveUser().success(function(data) {
			if (!data.success) {
				console.log(data);
			} else {
				$scope.projects = data.projects;
				angular.forEach($scope.projects, function(project) {
					project.created = new Date(project.created);
				});
			}
		});

		$scope.deleteProject = function(id) {
			ProjectService.delete(id).success(function(data) {
				if (data.success) {
					$scope.projects = $scope.projects.filter(function(project) {
						return project._id !== id;
					});
				}
			});
		};
	}
]);