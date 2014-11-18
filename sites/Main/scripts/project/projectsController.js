userModule.controller('ProjectsController', ['$scope', '$rootScope', '$global', '$timeout', '$location', 'ProjectService',
	function($scope, $rootScope, $global, $timeout, $location, ProjectService) {
		ProjectService.all().success(function(data) {
			if (!data.success) {
				console.log(data);
			} else {
				console.log(data);
				$scope.projects = data.projects;
			}
		});
	}
]);