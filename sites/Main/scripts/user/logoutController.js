userModule.controller('LogoutController', ['$scope', '$rootScope', 'UserService', 'localStorageService',
	function($scope, $rootScope, UserService, localStorageService) {
		//Logout using UserService
		$scope.logout = function() {
			var token = localStorageService.get('token');
			UserService.logout({
				token: token
			}).success(function(data) {
				if (!data.success) {
					console.log(data.message);
				} else {
					localStorageService.remove('token');
					$rootScope.isLoggedIn = false;
					console.log(data.message)
				}
			});
		};
	}
]);