moduleModule.controller('ModulesController', ['$scope', 'ModuleService',
	function($scope, ModuleService) {
		ModuleService.all().success(function(data) {
			if (data.success) {
				$scope.modules = data.modules;
			} else {
				console.log(data);
			}
		});

		$scope.deleteModule = function(id) {
			ModuleService.delete(id).success(function(data) {
				if (data.success) {
					$scope.modules = $scope.modules.filter(function(module) {
						return module._id !== id;
					});
				}
			});
		};
	}
]);