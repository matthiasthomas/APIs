userModule.controller('LogoutController', ['$scope', '$rootScope', 'UserService', 'localStorageService',
	function($scope, $rootScope, UserService, localStorageService) {
		//Logout using UserService
		$scope.logout = function() {
			console.log('logout');
			UserService.logout().success(function(data) {
				if (!data.success) {
					console.log(data.message);
				} else {
					localStorageService.remove('token');
					$rootScope.isLoggedIn = false;
					console.log(data.message);
					$location.path('/');
				}
			});
		};
	}
]);