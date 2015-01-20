akioo.controller('IndexController', ['$scope', '$translate', '$location', '$anchorScroll', 'localStorageService',
	function($scope, $translate, $location, $anchorScroll, localStorageService) {
		$scope.changeLanguage = function(key) {
			$translate.use(key);
			localStorageService.set('userLanguage', key);
		};

		$scope.getLanguage = function() {
			return $translate.use();
		};
	}
]);