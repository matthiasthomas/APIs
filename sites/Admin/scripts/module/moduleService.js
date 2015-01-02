moduleModule.factory('ModuleService', ['$http',
	function($http) {
		return {
			get: function(id) {
				return $http.get(myApp.globals.serverUrl + "api/modules/" + id);
			},
			post: function(module) {
				return $http.post(myApp.globals.serverUrl + "api/modules", module);
			},
			put: function(id, module) {
				return $http.put(myApp.globals.serverUrl + "api/modules/" + id, module);
			},
			delete: function(id) {
				return $http.delete(myApp.globals.serverUrl + "api/modules/" + id);
			},
			all: function() {
				return $http.get(myApp.globals.serverUrl + "api/modules");
			}
		};
	}
]);