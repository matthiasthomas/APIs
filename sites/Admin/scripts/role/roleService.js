roleModule.factory('RoleService', ['$http',
	function($http) {
		return {
			get: function(id) {
				return $http.get(myApp.globals.serverUrl + "api/rbac/roles/" + id);
			},
			post: function(role) {
				return $http.post(myApp.globals.serverUrl + "api/rbac/roles", role);
			},
			put: function(id, role) {
				return $http.put(myApp.globals.serverUrl + "api/rbac/roles/" + id, role);
			},
			delete: function(id) {
				return $http.delete(myApp.globals.serverUrl + "api/rbac/roles/" + id);
			},
			all: function() {
				return $http.get(myApp.globals.serverUrl + "api/rbac/roles");
			}
		};
	}
]);