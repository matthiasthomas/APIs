userModule.controller('ForgotPasswordController', ['$http', '$scope', '$global', 'UserService',
	function($http, $scope, $global, UserService) {

		$scope.message = "";
		$scope.email = "";

		// -- Taken From Forza2 Theme -- //
		$global.set('fullscreen', true);

		$scope.$on('$destroy', function() {
			$global.set('fullscreen', false);
		});
		// End -- Taken From Forza2 Theme -- //

		$scope.sendRequest = function() {
			UserService.forgotPassword($scope.email).success(function(data) {
				console.log(data);
				if (data.success) {
					$scope.message = "Your new password has been sent to " + $scope.email;
				} else {
					$scope.message = "The email address: " + $scope.email + " is not in our database";
				}
			});
		};

		$scope.resetMessage = function() {
			$scope.message = "";
		};
	}
]);