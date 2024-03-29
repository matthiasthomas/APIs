userModule.controller('LoginController', ['$http', '$scope', '$rootScope', '$location', '$global', 'UserService', 'localStorageService',
	function($http, $scope, $rootScope, $location, $global, UserService, localStorageService) {
		//Login using UserService

		// -- Taken From Forza2 Theme -- //
		$global.set('fullscreen', true);

		$scope.$on('$destroy', function() {
			$global.set('fullscreen', false);
		});
		// End -- Taken From Forza2 Theme -- //


		$scope.login = function() {
			var email = $scope.email;
			var password = $scope.password;

			UserService.login({
				email: email,
				password: password
			}).success(function(data) {
				if (!data.success) {
					console.log(data.message);
				} else {
					$rootScope.activeUser = data.user;
					localStorageService.set("activeUser", data.user);
					localStorageService.set('token', data.token);
					//Set headers for all $http requests
					$http.defaults.headers.common['x-access-token'] = localStorageService.get('token');
					$rootScope.isLoggedIn = true;
					console.log(data.message);

					setTimeout(function() {
						$location.path('/');
					}, 500);
				}
			});
		};
	}
]);