myApp.config(['localStorageServiceProvider', 'uiGmapGoogleMapApiProvider',
	function(localStorageServiceProvider, uiGmapGoogleMapApiProvider) {
		localStorageServiceProvider
			.setPrefix('akioo');

		uiGmapGoogleMapApiProvider.configure({
			key: 'AIzaSyDpi57pvzWh5ob_aq-ry2t507uO00Ka7-w',
			v: '3.17',
			libraries: 'weather,geometry,visualization,places'
		});
	}
]);

myApp.globals = {
	//serverUrl: "http://176.31.167.154:80/",
	serverUrl: "http://127.0.0.1:8080/"
};