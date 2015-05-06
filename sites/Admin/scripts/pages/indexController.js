pagesControllersModule.controller('IndexController', ['$http', '$scope', '$rootScope', 'UserService', 'localStorageService',
	function($http, $scope, $rootScope, UserService, localStorageService) {
		$scope.activeUser = function() {
			return UserService.activeUser();
		};
	}
]);