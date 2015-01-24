akioo.controller('IndexController', ['$scope', '$translate', '$location', '$anchorScroll', 'localStorageService', 'ProjectService',
	function($scope, $translate, $location, $anchorScroll, localStorageService, ProjectService) {
		$scope.changeLanguage = function(key) {
			$translate.use(key);
			localStorageService.set('userLanguage', key);
		};

		$scope.getLanguage = function() {
			return $translate.use();
		};

		ProjectService.get('54bfeae7dc82d70000cb83ee').success(function(data) {
			if (data.success) {
				console.log(data);
				$scope.project = data.project;

				(function(i, s, o, g, r, a, m) {
					i['GoogleAnalyticsObject'] = r;
					i[r] = i[r] || function() {
						(i[r].q = i[r].q || []).push(arguments)
					}, i[r].l = 1 * new Date();
					a = s.createElement(o),
						m = s.getElementsByTagName(o)[0];
					a.async = 1;
					a.src = g;
					m.parentNode.insertBefore(a, m)
				})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

				ga('create', $scope.project.googleAnalyticsID, 'auto');
				ga('send', 'pageview');

			}
		});
	}
]);