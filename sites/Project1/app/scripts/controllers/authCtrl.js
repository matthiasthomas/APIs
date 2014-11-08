myApp.controller('AuthCtrl', ['$scope', 'AuthService', 'localStorageService',
	function($scope, AuthService, localStorageService) {
		//Login using AuthService
		$scope.login = function() {
			var username = $scope.username;
			var password = $scope.password;

			AuthService.login({
				username: username,
				password: password
			}).success(function(data) {
				if (!data.success) {
					console.log(data.message);
				} else {
					localStorageService.set('token', data.token);
					$scope.connected = true;
					console.log(data.message);
				}
			});
		};

		//Logout using AuthService
		$scope.logout = function() {
			var token = localStorageService.get('token');
			AuthService.logout({
				token: token
			}).success(function(data) {
				if (!data.success) {
					console.log(data.message);
				} else {
					localStorageService.remove('token');
					$scope.connected = false;
					console.log(data.message)
				}
			});
		};

		$scope.register = function() {
			AuthService.register($scope.user).success(function(data) {
				if (!data.success) {
					console.log(data.message);
				} else {
					$scope.username = data.user.username;
					$scope.password = data.user.password;
					login();
				}
			});
		};
	}
]);