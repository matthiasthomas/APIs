modulesModule.controller('ModulesRealestatePropertyTypesController', ['$scope', 'UserService', 'RoleService', 'ModulesRealestatePropertyTypeService',
	function($scope, UserService, RoleService, ModulesRealestatePropertyTypeService) {
		ModulesRealestatePropertyTypeService.getForActiveUser().success(function(data) {
			if (data.success) {
				$scope.propertyTypes = data.propertyTypes;
			} else {
				console.log(data);
			}
		});

		$scope.activeUser = UserService.activeUser();
		$scope.hasRole = function(user, role) {
			return RoleService.hasRole(user, role);
		};

		$scope.deletePropertyType = function(id) {
			ModulesRealestatePropertyTypeService.delete(id).success(function(data) {
				if (data.success) {
					$scope.propertyTypes = $scope.propertyTypes.filter(function(propertyType) {
						return propertyType._id !== id;
					});
				}
			});
		};
	}
]);