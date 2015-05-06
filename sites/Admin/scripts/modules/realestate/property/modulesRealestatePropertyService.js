modulesModule.factory('ModulesRealestatePropertyService', ['$http',
	function($http) {
		return {
			get: function(id) {
				return $http.get(myApp.globals.serverUrl + "api/realestate/properties/" + id);
			},
			post: function(property) {
				return $http.post(myApp.globals.serverUrl + "api/realestate/properties", property);
			},
			put: function(property) {
				return $http.put(myApp.globals.serverUrl + "api/realestate/properties/" + property._id, property);
			},
			delete: function(id) {
				return $http.delete(myApp.globals.serverUrl + "api/realestate/properties/" + id);
			},
			all: function() {
				return $http.get(myApp.globals.serverUrl + "api/realestate/properties");
			},
			getForActiveUser: function() {
				return $http.get(myApp.globals.serverUrl + "api/realestate/properties/getForActiveUser");
			}
		};
	}
]);