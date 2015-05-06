moduleModule.controller('EditModuleController', ['$scope', 'ModuleService', '$routeParams', '$location',
	function($scope, ModuleService, $routeParams, $location) {
		var moduleId = $routeParams.id;

		ModuleService.get(moduleId).success(function(data) {
			if (data.success) {
				$scope.module = data.module;
			} else {
				console.log(data);
			}
		});

		$scope.saveModule = function() {
			console.log($scope.module);
			ModuleService.put($scope.module._id, $scope.module).success(function(data) {
				if (data.success) {
					$location.path('/modules');
				} else {
					console.log(data);
				}
			});
		};
	}
]);