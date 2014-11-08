myApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'views/main.html',
			controller: 'AuthCtrl'
		}).
		otherwise({
			redirectTo: '/'
		});
	}
]);

myApp.config(['localStorageServiceProvider',
	function(localStorageServiceProvider) {
		localStorageServiceProvider
			.setPrefix('myApp');
	}
]);

myApp.globals = {
	serverUrl: "http://127.0.0.1:8080/",
	projectName: "ecig"
}