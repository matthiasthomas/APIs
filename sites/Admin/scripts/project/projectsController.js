userModule.controller('ProjectsController', ['$scope', '$rootScope', '$global', '$timeout', '$location', 'ProjectService',
	function($scope, $rootScope, $global, $timeout, $location, ProjectService) {
		ProjectService.all().success(function(data) {
			if (!data.success) {
				console.log(data);
			} else {
				console.log(data);
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