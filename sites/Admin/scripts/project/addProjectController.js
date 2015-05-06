projectModule.controller('AddProjectController', ['$scope', '$rootScope', '$global', '$timeout', '$location', 'ProjectService', 'ModuleService',
	function($scope, $rootScope, $global, $timeout, $location, ProjectService, ModuleService) {
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

		ModuleService.all().success(function(data) {
			if (data.success) {
				data.modules.forEach(function(module) {
					$scope.modules.push({
						_id: module._id,
						name: module.name,
						checked: false
					});
				});
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
			$scope.modules.forEach(function(module) {
				if (module.checked) {
					$scope.project.modules.push({
						_id: module._id
					});
				}
			});
			ProjectService.post($scope.project).success(function(data) {
				if (data.success) {
					$location.path('/projects');
				} else {

				}
			});
		};
	}
]);