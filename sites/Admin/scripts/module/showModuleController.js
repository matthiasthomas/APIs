moduleModule.controller('ShowModuleController', ['$scope', 'ModuleService', '$routeParams',
	function($scope, ModuleService, $routeParams) {
		//$scope.showMode = true; // Would be great to have only one html file no time now
		var moduleId = $routeParams.id;

		ModuleService.get(moduleId).success(function(data) {
			if (data.success) {
				$scope.module = data.module;
			} else {
				console.log(data);
			}
		});
	}
]);