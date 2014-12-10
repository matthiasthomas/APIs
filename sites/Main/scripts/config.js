myApp.config(['localStorageServiceProvider',
	function(localStorageServiceProvider) {
		localStorageServiceProvider
			.setPrefix('myApp');
	}
]);

myApp.globals = {
	serverUrl: "http://127.0.0.1:8080/",
	projectName: "ecig"
};