modulesModule.controller('ModulesRealestateAddAgentController', ['$scope', 'FileUploader', 'localStorageService', '$location', 'ProjectService', 'ModulesRealestateAgentService',
	function($scope, FileUploader, localStorageService, $location, ProjectService, ModulesRealestateAgentService) {
		$scope.agent = {
			name: "",
			_image: "",
			phone: "",
			email: "",
			projects: []
		};

		$scope.uploader = new FileUploader({
			url: myApp.globals.serverUrl + "api/realestate/properties/images",
			headers: {
				"x-access-token": localStorageService.get('token')
			}
		});

		$scope.uploader.onAfterAddingFile = function(item) {
			if ($scope.uploader.queue.length > 1) {
				$scope.uploader.queue.splice(0, 1);
			}
		};

		$scope.uploader.onCompleteItem = function(item, response, status, headers) {
			if (response.success) {
				$scope.agent._image = response.image._id;
			} else {
				console.log(response.message);
			}
		};

		$scope.uploader.onCompleteAll = function() {
			console.log("everything was uploaded");
			saveAgent();
		};

		ProjectService.getForActiveUser().success(function(data) {
			if (data.success) {
				data.projects.forEach(function(project) {
					$scope.agent.projects.push({
						_id: project._id,
						name: project.name,
						checked: false
					});
				});
			} else {
				console.log(data);
			}
		});

		$scope.addAgent = function() {
			if ($scope.uploader.queue.length > 0) {
				$scope.uploader.uploadAll();
			} else {
				saveAgent();
			}
		};

		var saveAgent = function() {
			$scope.agent.projects = $scope.agent.projects.filter(function(project) {
				return (project.checked || $scope.agent.projects.length === 1);
			});

			ModulesRealestateAgentService.post($scope.agent).success(function(data) {
				if (data.success) {
					$location.path('/modules/realestate/agents');
				} else {
					console.log(data);
				}
			});
		};
	}
]);