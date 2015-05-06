moduleModule.controller('AddModuleController', ['$scope', 'ModuleService', '$location',
	function($scope, ModuleService, $location) {
		$scope.module = {
			name: "",
			details: "",
			fixedCost: 0,
			costPerMonth: 0
		};

		$scope.saveModule = function() {
			ModuleService.post($scope.module).success(function(data) {
				if (data.success) {
					$location.path('/modules');
				} else {
					console.log(data);
				}
			});
		};
	}
]);