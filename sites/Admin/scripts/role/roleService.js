roleModule.factory('RoleService', ['$http',
	function($http) {
		return {
			hasRole: function(user, role) {
				if (typeof role !== 'string') {
					role = role.name;
				}
				var found = false;
				user.roles.forEach(function(userRole) {
					if (userRole.name == role) {
						found = true;
					}
				});
				return found;
			},
			get: function(id) {
				return $http.get(myApp.globals.serverUrl + "api/roles/" + id);
			},
			post: function(role) {
				return $http.post(myApp.globals.serverUrl + "api/roles", role);
			},
			put: function(id, role) {
				return $http.put(myApp.globals.serverUrl + "api/roles/" + id, role);
			},
			delete: function(id) {
				return $http.delete(myApp.globals.serverUrl + "api/roles/" + id);
			},
			all: function() {
				return $http.get(myApp.globals.serverUrl + "api/roles");
			}
		};
	}
]);