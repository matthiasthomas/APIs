modulesModule.controller('ModulesRealestateAddPropertyTypeController', ['$scope', 'ModulesRealestatePropertyTypeService', 'ProjectService', '$location',
	function($scope, ModulesRealestatePropertyTypeService, ProjectService, $location) {
		$scope.propertyType = {
			name: "",
			description: "",
			projects: []
		};

		ProjectService.getForActiveUser().success(function(data) {
			if (data.success) {
				data.projects.forEach(function(project) {
					$scope.propertyType.projects.push({
						_id: project._id,
						name: project.name,
						checked: false
					});
				});
			} else {
				console.log(data);
			}
		});

		$scope.savePropertyType = function() {
			$scope.propertyType.projects.filter(function(project) {
				return (project.checked || $scope.propertyType.projects.length === 1);
			});
			ModulesRealestatePropertyTypeService.post($scope.propertyType).success(function(data) {
				if (data.success) {
					$location.path('/modules/realestate/propertyTypes');
				} else {
					console.log(data);
				}
			});
		};
	}
]);