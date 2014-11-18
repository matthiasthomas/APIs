userModule.controller('ProjectsController', ['$scope', '$rootScope', '$global', '$timeout', '$location', 'ProjectService',
	function($scope, $rootScope, $global, $timeout, $location, ProjectService) {
		ProjectService.all().success(function(datas) {
			if (!data.success) {
				console.log(data.message);
			} else {
				console.log(data.message);
				$scope.projects = data.projects;
			}
		});
	}
]);