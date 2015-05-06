modulesModule.controller('ModulesRealestatePropertiesController', ['$scope', 'ModulesRealestatePropertyService',
	function($scope, ModulesRealestatePropertyService) {
		ModulesRealestatePropertyService.getForActiveUser().success(function(data) {
			if (data.success) {
				$scope.properties = data.properties;
			} else {
				console.log(data);
			}
		});

		$scope.deleteProperty = function(id) {
			ModulesRealestatePropertyService.delete(id).success(function(data) {
				console.log(data);
				if (data.success) {
					$scope.properties = $scope.properties.filter(function(property) {
						return property._id !== id;
					});
				} else {
					console.log(data);
				}
			});
		};
	}
]);