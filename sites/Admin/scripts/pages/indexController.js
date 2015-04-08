pagesControllersModule.controller('IndexController', ['$http', '$scope', '$rootScope', 'UserService', 'localStorageService',
	function($http, $scope, $rootScope, UserService, localStorageService) {
		if (localStorageService.get('activeUser') && !$scope.activeUser) {
			$scope.activeUser = localStorageService.get('activeUser');
		}
	}
]);