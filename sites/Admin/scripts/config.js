myApp.config(['localStorageServiceProvider',
	function(localStorageServiceProvider) {
		localStorageServiceProvider
			.setPrefix('akioo');
	}
]);

myApp.globals = {
	serverUrl: "http://176.31.167.154:80/",
	//serverUrl: "http://127.0.0.1:8080/"
};