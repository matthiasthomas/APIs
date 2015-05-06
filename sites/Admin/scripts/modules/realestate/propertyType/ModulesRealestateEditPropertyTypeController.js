modulesModule.controller('ModulesRealestateEditPropertyTypeController', ['$scope', 'ModulesRealestatePropertyTypeService', 'ProjectService', '$location', '$routeParams',
	function($scope, ModulesRealestatePropertyTypeService, ProjectService, $location, $routeParams) {
		var propertyTypeId = $routeParams.id;

		ModulesRealestatePropertyTypeService.get(propertyTypeId).success(function(data) {
			if (data.success) {
				$scope.propertyType = data.propertyType;
				ProjectService.getForActiveUser().success(function(data) {
					if (data.success) {
						var projects = [];
						data.projects.forEach(function(project) {
							var checked = false;
							$scope.propertyType.projects.forEach(function(propertyTypeProject) {
								if (project._id == propertyTypeProject._id) checked = true;
							});
							projects.push({
								_id: project._id,
								name: project.name,
								checked: checked
							});
						});
						$scope.propertyType.projects = projects;
					} else {
						console.log(data);
					}
				});
			} else {
				console.log(data);
			}
		});

		$scope.savePropertyType = function() {
			$scope.propertyType.projects = $scope.propertyType.projects.filter(function(project) {
				return (project.checked || $scope.propertyType.projects.length === 1);
			});
			console.log($scope.propertyType.projects);
			ModulesRealestatePropertyTypeService.put($scope.propertyType._id, $scope.propertyType).success(function(data) {
				if (data.success) {
					$location.path('/modules/realestate/propertyTypes');
				} else {
					console.log(data);
				}
			});
		};
	}
]);