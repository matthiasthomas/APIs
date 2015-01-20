userModule.controller('AddProjectController', ['$scope', '$rootScope', '$global', '$timeout', '$location', 'ProjectService',
	function($scope, $rootScope, $global, $timeout, $location, ProjectService) {
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
			ProjectService.post($scope.project).success(function(data) {
				if (data.success) {
					$location.path('/projects');
				} else {

				}
			});
		};
	}
]);