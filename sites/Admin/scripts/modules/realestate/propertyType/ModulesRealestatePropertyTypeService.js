modulesModule.factory('ModulesRealestatePropertyTypeService', ['$http',
	function($http) {
		return {
			get: function(id) {
				return $http.get(myApp.globals.serverUrl + "api/realestate/propertyTypes/" + id);
			},
			post: function(propertyType) {
				return $http.post(myApp.globals.serverUrl + "api/realestate/propertyTypes", propertyType);
			},
			put: function(id, propertyType) {
				return $http.put(myApp.globals.serverUrl + "api/realestate/propertyTypes/" + id, propertyType);
			},
			delete: function(id) {
				return $http.delete(myApp.globals.serverUrl + "api/realestate/propertyTypes/" + id);
			},
			all: function() {
				return $http.get(myApp.globals.serverUrl + "api/realestate/propertyTypes");
			},
			getForActiveUser: function() {
				return $http.get(myApp.globals.serverUrl + "api/realestate/propertyTypes/getForActiveUser");
			}
		};
	}
]);