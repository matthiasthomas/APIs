userModule.controller('RegistrationController', ['$scope', '$rootScope', '$global', '$timeout', '$location', 'UserService', 'localStorageService',
	function($scope, $rootScope, $global, $timeout, $location, UserService, localStorageService) {
		//Register using UserService

		// -- Taken From Forza2 Theme -- //
		$global.set('fullscreen', true);

		$scope.$on('$destroy', function() {
			$global.set('fullscreen', false);
		});

		$scope.checking = false;
		$scope.checked = false;
		$scope.checkAvailability = function() {
			if ($scope.reg_form.username.$dirty == false) return;
			$scope.checking = true;
			$timeout(function() {
				$scope.checking = false;
				$scope.checked = true;
			}, 500);
		};
		// End -- Taken From Forza2 Theme -- //

		$scope.register = function() {
			var username = $scope.user.username;
			var password = $scope.user.password;
			UserService.register($scope.user).success(function(data) {
				if (!data.success) {
					console.log(data.message);
					//if registration succeeded
				} else {
					UserService.login({
						username: username,
						password: password
					}).success(function(data) {
						if (!data.success) {
							console.log(data.message);
						} else {
							localStorageService.set('token', data.token);
							$rootScope.isLoggedIn = true;
							console.log(data.message);
							$location.path('/');
						}
					});
				}
			});
		};
	}
]);