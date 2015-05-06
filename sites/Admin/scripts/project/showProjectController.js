projectModule.controller('ShowProjectController', ['$routeParams', '$scope', 'ProjectService', 'ModuleService',
	function($routeParams, $scope, ProjectService, ModuleService) {
		$scope.project = {};
		$scope.project.modules = [];
		$scope.project.contacts = [{
			label: '',
			address: '',
			city: '',
			zipcode: '',
			country: '',
			phones: [{
				number: '',
				type: ''
			}]
		}];
		$scope.modules = [];
		$scope.noModules = false;
		var projectId = $routeParams.id;

		ProjectService.get(projectId).success(function(data) {
			if (data.success) {
				$scope.project = data.project;
				if (data.project.modules.length === 0) $scope.noModules = true;
				ModuleService.all().success(function(data) {
					if (data.success) {
						data.modules.forEach(function(module) {
							var found = false;
							$scope.project.modules.forEach(function(projectModule) {
								if (module._id == projectModule._id) found = true;
							});
							if (found) {
								$scope.modules.push({
									_id: module._id,
									name: module.name,
									checked: true
								});
							} else {
								$scope.modules.push({
									_id: module._id,
									name: module.name,
									checked: false
								});
							}
						});
					} else {
						console.log(data);
					}
				});
			} else {
				console.log(data);
			}
		});
	}
]);