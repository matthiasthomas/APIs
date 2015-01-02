myApp.config(['localStorageServiceProvider',
	function(localStorageServiceProvider) {
		localStorageServiceProvider
			.setPrefix('myApp');
	}
]);

myApp.globals = {
	//serverUrl: "http://37.187.183.128:8080/",
	serverUrl: "http://127.0.0.1:8080/"
};