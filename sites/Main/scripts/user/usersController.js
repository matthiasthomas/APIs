userModule.controller('UsersController', ['$scope', '$rootScope', '$global', '$timeout', '$location', 'UserService', 'RoleService',
	function($scope, $rootScope, $global, $timeout, $location, UserService, RoleService) {
		UserService.all().success(function(data) {
			$scope.users = data;
		});

		RoleService.all().success(function(data) {
			$scope.roles = data;
		});

		$scope.saveUser = function(data, id) {
			console.log(data);
			console.log(id);
			var email = data.email;
			var _role = data.role;

		};
	}
]);