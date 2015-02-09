roleModule.controller('RolesController', ['$scope', 'RoleService', 'ModelService', 'pinesNotifications',
	function($scope, RoleService, ModelService, pinesNotifications) {
		RoleService.all().success(function(data) {
			if (data.success) {
				$scope.roles = data.roles;
			} else {
				console.log(data);
			}
		});

		$scope.addedModels = [];
		$scope.updateModels = function() {
			ModelService.update().success(function(data) {
				var text = "";
				if (data.addedModels.length > 0) {
					text = "Those models have been added to the database: ";
					data.addedModels.forEach(function(addedModel) {
						text = text + addedModel + ", ";
					});
				} else {
					text = "No new models to add!";
				}
				//Delete the last ", "
				if (text.slice((text.length - 2), 2) == ", ") {
					text = text.slice((text.length - 2), 2);
				}
				$scope.alert = {
					type: 'success',
					msg: text,
					show: true
				};
			});
		};

		$scope.closeAlert = function(index) {
			$scope.alert = {
				show: false
			};
		};
	}
]);