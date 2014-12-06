userModule.controller('UsersController', ['$scope', '$rootScope', '$global', '$timeout', '$location', 'UserService', 'UsersProjectService', 'RoleService',
	function($scope, $rootScope, $global, $timeout, $location, UserService, UsersProjectService, RoleService) {
		UserService.all().success(function(data) {
			$scope.users = data.users;
			angular.forEach($scope.users, function(user) {
				user.projects = [];
				UsersProjectService.getByUser(user._id).success(function(data) {
					if (data.success) {
						console.log(data);
						angular.forEach(data.usersProjects, function(usersProject) {
							user.projects.push(usersProject._project.name);
						});
					}
				});
			});
		});

		RoleService.all().success(function(data) {
			$scope.roles = data.roles;
		});

		$scope.deleteUser = function(id) {
			UserService.delete(id).success(function(data) {
				if (data.success) {
					$scope.users = $scope.users.filter(function(user) {
						return user._id !== id;
					});
				}
				console.log(data);
			});
		};
	}
]);