userModule.controller('LogoutController', ['$scope', '$rootScope', 'UserService', 'localStorageService', '$location',
	function($scope, $rootScope, UserService, localStorageService, $location) {
		//Logout using UserService
		$scope.logout = function() {
			console.log('logout');
			UserService.logout().success(function(data) {
				if (!data.success) {
					console.log(data.message);
				} else {
					localStorageService.remove('token');
					localStorageService.remove('activeUser');
					$rootScope.isLoggedIn = false;
					$location.path('/login');
				}
			});
		};
	}
]);