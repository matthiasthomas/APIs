modelModule.factory('ModelService', ['$http',
	function($http) {
		return {
			update: function() {
				return $http.get(myApp.globals.serverUrl + "api/models/update");
			},
			all: function() {
				return $http.get(myApp.globals.serverUrl + "api/models/");
			}
		};
	}
]);