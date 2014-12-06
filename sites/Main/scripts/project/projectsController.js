userModule.controller('ProjectsController', ['$scope', '$rootScope', '$global', '$timeout', '$location', 'ProjectService',
	function($scope, $rootScope, $global, $timeout, $location, ProjectService) {
		ProjectService.all().success(function(data) {
			if (!data.success) {
				console.log(data);
			} else {
				console.log(data);
				$scope.projects = data.projects;
				angular.forEach($scope.projects, function(project) {
					console.log(project.created);
					project.created = new Date(project.created);
					console.log(project.created);
				});
			}
		});
	}
]);