userModule.controller('EditProjectController', ['$scope', '$rootScope', '$routeParams', '$global', '$timeout', '$location', 'ProjectService',
	function($scope, $rootScope, $routeParams, $global, $timeout, $location, ProjectService) {
		$scope.project = {};
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
		var projectId = $routeParams.id;

		ProjectService.get(projectId).success(function(data) {
			if (data.success) {
				$scope.project = data.project;
			} else {
				console.log(data);
			}
		});

		$scope.addPhone = function(i) {
			$scope.project.contacts[i].phones.push({
				number: '',
				type: ''
			});
		};

		$scope.removePhone = function(contactIndex, phoneIndex) {
			$scope.project.contacts[contactIndex].phones.splice(phoneIndex, 1);
		};

		$scope.addContact = function() {
			$scope.project.contacts.push({
				label: '',
				address: '',
				city: '',
				zipcode: '',
				country: '',
				phones: [{
					number: '',
					type: ''
				}]
			});
		};

		$scope.removeContact = function(contactIndex) {
			$scope.project.contacts.splice(contactIndex, 1);
		};

		$scope.addProject = function() {
			ProjectService.put($scope.project._id, $scope.project).success(function(data) {
				if (data.success) {
					$location.path('/projects');
				} else {
					console.log(data);
				}
			});
		};
	}
]);