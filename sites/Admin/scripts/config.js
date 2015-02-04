myApp.config(['localStorageServiceProvider',
	function(localStorageServiceProvider) {
		localStorageServiceProvider
			.setPrefix('akioo');
	}
]);

myApp.globals = {
	//serverUrl: "http://37.187.183.128:80/",
	serverUrl: "http://127.0.0.1:8080/"
};